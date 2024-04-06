class ProjectileFactory {
    static create(type, startPos, targetPos) {
        const projectileMap = {
            [ProjectileFactory.ROCK]: Rock,
            [ProjectileFactory.SLIMEBALL]: Slimeball,
            [ProjectileFactory.BOMB]: Bomb,
            [ProjectileFactory.SNOWBALL]: Snowball,
            [ProjectileFactory.SUS_SNOWBALL]: SusSnowball,
            [ProjectileFactory.BROCCOLI]: Broccoli,
            [ProjectileFactory.WATER_BALLOON]: WaterBalloon,
            [ProjectileFactory.LASER]: Laser,
            [ProjectileFactory.SONIC_WAVE]: SonicWave,
            [ProjectileFactory.MISSILE]: Missile,
        };
        return new (projectileMap[type])(startPos, targetPos);
    }

    static get ROCK() {
        return "rock";
    }

    static get BOMB() {
        return "bomb";
    }

    static get SNOWBALL() {
        return "snowball";
    }

    static get SLIMEBALL() {
        return "slimeball";
    }

    static get BROCCOLI() {
        return "broccoli";
    }

    static get SUS_SNOWBALL() {
        return "sus_snowball";
    }

    static get WATER_BALLOON() {
        return "water_balloon";
    }

    static get LASER() {
        return "laser";
    }

    static get SONIC_WAVE() {
        return "sonic_wave";
    }

    static get MISSILE() {
        return "missile";
    }
}