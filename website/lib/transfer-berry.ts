import {
    Connection,
    PublicKey,
    Transaction,
} from "@solana/web3.js"
import {
    getAssociatedTokenAddress,
    createTransferInstruction,
    getAccount,
    createAssociatedTokenAccountInstruction,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token"

const BERRY_DECIMALS = 9

export async function getBerryBalance(
    connection: Connection,
    ownerPubkey: PublicKey
): Promise<number> {
    const mintStr = process.env.NEXT_PUBLIC_BERRY_TOKEN_MINT
    if (!mintStr) return 0

    const mint = new PublicKey(mintStr)

    try {
        const ata = await getAssociatedTokenAddress(mint, ownerPubkey)
        const account = await getAccount(connection, ata)
        return Number(account.amount) / 10 ** BERRY_DECIMALS
    } catch {
        return 0
    }
}

/**
 * Builds a Berry token transfer transaction (unsigned).
 * Does NOT set feePayer or recentBlockhash — the wallet adapter's
 * sendTransaction handles that automatically.
 */
export async function buildBerryTransferTx(
    connection: Connection,
    fromPubkey: PublicKey,
    amount: number
): Promise<Transaction> {
    const mintStr = process.env.NEXT_PUBLIC_BERRY_TOKEN_MINT
    const treasuryStr = process.env.NEXT_PUBLIC_TREASURY_PUBKEY

    if (!mintStr || !treasuryStr) {
        throw new Error("Berry token or treasury not configured")
    }

    const mint = new PublicKey(mintStr)
    const treasury = new PublicKey(treasuryStr)

    const fromAta = await getAssociatedTokenAddress(mint, fromPubkey)
    const toAta = await getAssociatedTokenAddress(mint, treasury)

    const tx = new Transaction()

    // Check if buyer has a token account
    try {
        await getAccount(connection, fromAta)
    } catch {
        throw new Error("You don't have a BRRY token account. Please get some BRRY first!")
    }

    // Create the treasury ATA if needed
    try {
        await getAccount(connection, toAta)
    } catch {
        tx.add(
            createAssociatedTokenAccountInstruction(
                fromPubkey,
                toAta,
                treasury,
                mint,
                TOKEN_PROGRAM_ID,
                ASSOCIATED_TOKEN_PROGRAM_ID
            )
        )
    }

    const rawAmount = Number(amount) * 10 ** BERRY_DECIMALS

    tx.add(
        createTransferInstruction(fromAta, toAta, fromPubkey, rawAmount)
    )

    return tx
}
