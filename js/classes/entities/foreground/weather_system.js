const weatherType = {
    HOT: "hot",
    WARM: "warm",
    CLOUDS: "clouds",
    RAIN: "rain",
    SNOW: "snow"
};

/**
 * WeatherSystem manages what weather to spawn into a zone.
 * 
 * @author Caleb Krauter
 */
class WeatherSystem {

    static setWeather(type = "snow", intensity = 3, time = "day", startingYOfClouds = 19) {
        WeatherSystem.type = type;
        WeatherSystem.intensity = intensity;
        WeatherSystem.time = time;
        WeatherSystem.clouds = false;
        WeatherSystem.isRain = WeatherSystem.type === weatherType.RAIN;
        WeatherSystem.isSnow = WeatherSystem.type === weatherType.SNOW;
        WeatherSystem.isClouds = WeatherSystem.type === weatherType.CLOUDS;
        WeatherSystem.startingYOfClouds = startingYOfClouds;

        if (WeatherSystem.isRain) {
            WeatherSystem.clouds = true;
            WeatherSystem.makeHeavens();
            WeatherSystem.makeClouds();
            WeatherSystem.makePrecipitation();
        }
        else if (WeatherSystem.isSnow) {
            WeatherSystem.clouds = true;
            WeatherSystem.makeHeavens();
            WeatherSystem.makeClouds();
            WeatherSystem.makePrecipitation();
        } else if (WeatherSystem.isClouds) {
            WeatherSystem.clouds = true;
            WeatherSystem.makeHeavens();
            WeatherSystem.makeClouds();
            // Default to sunny with white clouds
        } else {
            WeatherSystem.makeHeavens();
        }
    }

    /**
     * Adds a sun/moon and updates the sky color.
     */
    static makeHeavens() {
        let sunVector = new Vector(Camera.SIZE.x - 2 * Sun.SCALED_SIZE, Sun.SCALED_SIZE - 100);
        if (WeatherSystem.time === "night") {
            BG_COLOR = COLORS.SKY_DARK_BLUE;
            GAME.addEntity(new Sun(sunVector, Sun.MOON), -1);

        } else {
            const bgColors = {
                warm: COLORS.SKY_BLUE,
                hot: COLORS.SKY_HOT_SKY,
                clouds: COLORS.SKY_GREY,
                rain: COLORS.SKY_GREY,
                snow: COLORS.SKY_SNOW_GREY,
            }
            BG_COLOR = bgColors[WeatherSystem.type];
            if (!WeatherSystem.clouds) {

                let sunType = WeatherSystem.type == weatherType.HOT ? Sun.LAVA : Sun.VILLAGE;
                GAME.addEntity(new Sun(sunVector, sunType), -1);
            }

        }

    }

    /**
     * Adds clouds.
     */
    static makeClouds() {
        const cloudIntensity = [2, 5, 10, 20, 25, 50];
        WeatherSystem.clouds = true;
        // TODO add in dark clouds.


        let cloudNum = cloudIntensity[2];
        const cloudVariants = {
            0: Decoration.DECORATIONS.clouds.CLOUD_BUSHY,
            1: Decoration.DECORATIONS.clouds.CLOUD_LANKY,
            2: Decoration.DECORATIONS.clouds.CLOUD_JUST_CLOUD,
            3: Decoration.DECORATIONS.clouds.CLOUD_BUSHY_DARK,
            4: Decoration.DECORATIONS.clouds.CLOUD_LANKY_DARK,
            5: Decoration.DECORATIONS.clouds.CLOUD_JUST_CLOUD_DARK,
        };
        for (let cloudType = 0; cloudType < 3; cloudType++) {

            let spaceBetweenMultiplier = 0;
            spaceBetweenMultiplier = ZONE.MAX_BLOCK.x / cloudNum;

            for (let curCloud = 0; curCloud < cloudNum; curCloud++) {
                let background = -1;
                let yVariation = Math.random() * (10 - 16) + 14;
                let xVariation = Math.random() * (20 - 50) + 20;
                let cloudSpawnX = curCloud * spaceBetweenMultiplier + xVariation;
                let cloudSpawnY = WeatherSystem.startingYOfClouds - yVariation;
                let cloudPosition = Vector.blockToWorldSpace(new Vector(cloudSpawnX, cloudSpawnY));

                let cloudTypeOffset = 0;
                if (weatherType.RAIN === WeatherSystem.type || weatherType.SNOW === WeatherSystem.type) {
                    cloudTypeOffset = 3;
                }
                // Assign cloudVariant based on cloudType, defaulting to undefined if not found
                let cloudVariant = cloudVariants[cloudType + cloudTypeOffset];
                GAME.addEntity(new Decoration(cloudVariant, cloudPosition), background);

            }
        }

    }

    /**
     * Adds rain or snow.
     */
    static makePrecipitation() {
        let dir = ["left", "down", "right", "down", "down"];
        let precipitaitonIntensity = [5, 10, 15, 25, 45, 60];
        let dirIndex = Math.floor(Math.random() * dir.length);
        let scale = 1;
        let minDropsIntensity = 80;

        // There will be 80 snowflakes/raindrops added times the intensity of precipitaiton so that rain and snow look natural at varrying intensities.
        for (let curIntensity = 0; curIntensity < precipitaitonIntensity[WeatherSystem.intensity]; curIntensity++) {
            for (let curDropNum = 0; curDropNum < minDropsIntensity; curDropNum++) {
                if (WeatherSystem.type === "snow") {
                    scale = Math.random() * (.5 - .2) + .2;
                } else if (dir[dirIndex] !== "down") {
                    scale = Math.random() * (.8 - .4) + .6;
                } else {
                    scale = Math.random() * (1.2 - .5) + .8;
                }
                // TODO consider adjusting the y value of precipitation based on Chad's positon as what I have here currently may not
                // be appropriate for worlds where Chad's y value is highly different from the village world because the rain or snow origin may cut off
                // and be seen if the camera moves too high.
                // I changed the value from -10 to -30 to account for this issue as a bandaid fix. Not sure how this will affect performance.
                let offCanvasYBuffer = -30;
                // Using the current index of the drop for the x and y value of the drop's position creates a staggered effect of the drops as a whole.
                // This makes the rain and snow look natural. To experience the pattern of this phenomeon in a more controlled situation, go to precipitation
                // and comment out WeatherSystem.pos = Vector(0,0); and replace with WeatherSystem.pos = pos; This will show how the pattern induced by the positioning of the drops
                // functions before they are given more random positions and placed randomly above the top of the screen upon being reset.
                let pxPosCurDrop = new Vector(curDropNum, curDropNum + offCanvasYBuffer);
                let blockPosCurDrop = Vector.blockToWorldSpace(pxPosCurDrop);
                GAME.addEntity(new Precipitation(dir[dirIndex], blockPosCurDrop, WeatherSystem.type, scale), 1);
            }
        }
    }


    /**
     * Update does nothing.
     */
    update() {

    }

    /**
     * Draw does nothing.
     */
    draw() {

    }
}
