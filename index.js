// import robotjs library
var robot = require('robotjs');

function main() {
    console.log("Starting...");
    sleep(4000);

    while (true) {
        var tree = findTree();
        // if tree not found error message, exit loot
        if (tree == false) {
            rotateCamera();
            continue;
        }
        //chops down tree found
        robot.moveMouse(tree.x, tree.y);
        robot.mouseClick();
        sleep(3000);

        dropLogs();

    }
}

function dropLogs() {
    var inventory_x = 1842;
    var inventory_y = 757;
    var inventory_log_color = ["424320", "7a5d39"];

    var pixel_color = robot.getPixelColor(inventory_x, inventory_y);
    //console.log("inventory log color is:" + pixel_color);

    var wait_cycles = 0;
    var max_wait_cycle = 9;
    while (pixel_color != inventory_log_color && wait_cycles < max_wait_cycle) {
        //waiting for chopping to finish
        sleep(1000);
        //sample the pixel color
        pixel_color = robot.getPixelColor(inventory_x, inventory_y);
        //increment our counter
        wait_cycles++;


    }

    //drop logs from inventory
    if (pixel_color == inventory_log_color) {
    robot.moveMouse(inventory_x, inventory_y);
    robot.mouseClick('right');
    sleep(500);
    robot.moveMouse(inventory_x, inventory_y + 70);
    robot.mouseClick();
    sleep(1000);
    }
}

function testScreenCapture() {
    //taking screenshot
    var img = robot.screen.capture(0, 0, 1920, 1080);

    var pixel_color = img.colorAt(1842, 757);

    console.log(pixel_color);
}

function findTree() {
    var x = 300, y = 300, width = 1300, height = 400;
    var img = robot.screen.capture(x, y, width, height);

    var tree_colors = ["60492c", "5b462a", "6a5130", "6d5432", "705634", "574328"];

    for (var i = 0; i < 100; i++) {
        var random_x = getRandomInt(0, width - 1);
        var random_y = getRandomInt(0, height - 1);
        var sample_color = img.colorAt(random_x, random_y);

        if (tree_colors.includes(sample_color)) {
            var screen_x = random_x + x;
            var screen_y = random_y + y;

            if (confirmTree(screen_x, screen_y)) {
            console.log("found a tree at" + screen_x + "," + screen_y + "color" + sample_color);
            return { x: screen_x, y: screen_y};
            }
            else{
                console.log("Unconfirmed  tree at " + screen_x + ", " + screen_y + "color " + sample_color);
            }
        }
    }

    //did not find tree color inside screenshot
    return false;
}

function rotateCamera() {
    console.log("Rotating camera");
    robot.keyToggle("right", "down");
    sleep(1000);
    robot.keyToggle("right", "up");
}

function confirmTree(screen_x, screen_y) {
    //first move mouse to given cordinates
    robot.moveMouse(screen_x, screen_y);
    //wait a moment 
    sleep(300);

    //check color of tree text
    var check_x = 80;
    var check_y = 60;
    var pixel_color = robot.getPixelColor(check_x, check_y);

    return pixel_color == "00ffff";
    
}   

function sleep(ms) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

main();
