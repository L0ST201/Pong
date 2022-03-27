const config = {
    type: Phaser.AUTO,
    parent: 'game',

    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: {
        preload,
        create,
        update,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: false,
        }
    }
};

const game = new Phaser.Game(config);

let player, ball, cursors;
const keys = {};
let gameStarted = false;
let openingText, AIVictoryText, playerVictoryText;

function preload() {
    this.load.image('ball', '../assets/ball.png');
    this.load.image('paddle', '../assets/paddle.png');
}

function create() {
    ball = this.physics.add.sprite(
        this.physics.world.bounds.width / 2, // x position
        this.physics.world.bounds.height / 2, // y position
        'ball' // ball sprite
    );
    ball.setVisible(false);
        
    AI = this.physics.add.sprite(
        this.physics.world.bounds.width - (ball.body.width / 2 + 1), // x position
        this.physics.world.bounds.height / 2, // y position
        'paddle', // key of image for the sprite
    );

    player = this.physics.add.sprite(
        (ball.body.width / 2 + 1), // x position
        this.physics.world.bounds.height / 2, // y position
        'paddle', // paddle sprite
    );

    cursors = this.input.keyboard.createCursorKeys();


    AI.setCollideWorldBounds(true);
    player.setCollideWorldBounds(true);
    ball.setCollideWorldBounds(true);
    ball.setBounce(1, 1);
    AI.setImmovable(true);
    player.setImmovable(true);
    this.physics.add.collider(ball, AI, null, null, this);
    this.physics.add.collider(ball, player, null, null, this);

    openingText = this.add.text(
        this.physics.world.bounds.width / 2,
        this.physics.world.bounds.height / 2,
        'Press SPACE to Start',
        {
            fontFamily: 'Monaco, Courier, monospace',
            fontSize: '50px',
            fill: '#fff'
        }
    );
    
    openingText.setOrigin(0.5);

    // Create player 1 victory text
    AIVictoryText = this.add.text(
        this.physics.world.bounds.width / 2,
        this.physics.world.bounds.height / 2,
        'Point for CPU!',
        {
            fontFamily: 'Monaco, Courier, monospace',
            fontSize: '50px',
            fill: '#fff'
        }
    );

    AIVictoryText.setOrigin(0.5);

    // Make it invisible until the player loses
    AIVictoryText.setVisible(false);

    // Create the game won text
    playerVictoryText = this.add.text(
        this.physics.world.bounds.width / 2,
        this.physics.world.bounds.height / 2,
        'Point for Player!',
        {
            fontFamily: 'Monaco, Courier, monospace',
            fontSize: '50px',
            fill: '#fff'
        }
    );

    playerVictoryText.setOrigin(0.5);

    // Make it invisible until the player wins
    playerVictoryText.setVisible(false);
}

function update() {
    if (isAIPoint()) {
        AIVictoryText.setVisible(true);
        ball.disableBody(true, true);
        return;
    }
    if (isplayerPoint()) {
        playerVictoryText.setVisible(true);
        ball.disableBody(true, true);
        return;
    }

    AI.body.setVelocityY(0);
    player.body.setVelocityY(0);

    if (cursors.up.isDown) {
        player.body.setVelocityY(-350);
    } else if (cursors.down.isDown) {
        player.body.setVelocityY(350);
    }

    AI.body.velocity.setTo(ball.body.velocity.y);
    AI.body.velocity.x = 0;
    AI.body.maxVelocity.y = 250;

    if (!gameStarted) {
        if (cursors.space.isDown) {
            ball.setVisible(true);
            gameStarted = true;
            const initialXSpeed = Math.random() * 350 + 50;
            const initialYSpeed = Math.random() * 350 + 50;
            ball.setVelocityX(initialXSpeed);
            ball.setVelocityY(initialYSpeed);
            openingText.setVisible(false);
        }
    }
    
}

function isAIPoint() {
    return ball.body.x < player.body.x;
}

function isplayerPoint() {
    return ball.body.x > AI.body.x;
}

function hitPlayer(ball, player) {
    // custom logic for changing ball x or y velocity
}



