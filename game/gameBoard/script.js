function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function doSomething() {
    console.log("Start");
    await delay(2000); // Wait for 2 seconds
    console.log("2 seconds later");
}

doSomething();
