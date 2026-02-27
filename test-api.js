async function run() {
    try {
        const res = await fetch('http://localhost:3000/api/tapestry/outfits', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: 'Script Outfit',
                description: 'Testing the API creation',
                equippedItems: '{"HEAD":"item-1"}',
                profileId: 'testuser123'
            })
        });
        const data = await res.json();
        console.log("Create Outfit:", data);

        const feedRes = await fetch('http://localhost:3000/api/tapestry/feed');
        const feedData = await feedRes.json();
        console.log("Feed Data:", JSON.stringify(feedData, null, 2));

    } catch (e) {
        console.error(e);
    }
}
run();
