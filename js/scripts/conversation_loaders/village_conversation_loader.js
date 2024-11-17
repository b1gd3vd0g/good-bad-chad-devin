const villageConversationLoader = () => {
    return {
        papaChad: papaChadConversationLoader(),
        mayor: mayorConversationLoader(),
        blacksmith: blacksmithConversationLoader(),
        mamaChad: mamaChadConversationLoader(),
        miner: minerConversationLoader(),
        wizard: wizardConversationLoader()
    };
};

const papaChadConversationLoader = () => {
    const chad = DialogBubble.SPEAKERS.CHAD;
    const papa = DialogBubble.SPEAKERS.PAPA_CHAD;
    const none = DialogBubble.SPEAKERS.NONE;

    return {
        huntingInvite: [
            // 0
            new DialogBubble(papa,
                "Good morning Chad! Did you get a good night's rest?"),
            // 1
            new DialogBubble(chad,
                "I slept amazing Papa Chad! Snug as a bug in a rug. Had some crazy dreams though. I was in some spooky woods, and there were pigs everywhere!"),
            // 2
            new DialogBubble(papa,
                "Ha, sounds crazy son. Are you hungry? I'm about to go hunting, get some MEAT! for Mama Chad to cook up for us. You should join me!"),
            // 3
            new DialogBubble(chad,
                "I'm always hungry!"),
            // 4
            new DialogBubble(papa,
                "Heh, I know that's right. Well, get yourself ready and meet me on the western side of town. We'll go hunting in the field over yonder."),
            // 5
            new DialogBubble(none,
                "Use the A and D keys to move left and right!",
                true,
                () => {
                    STORY.invitedHunting = true;
                })
        ],
        huntingInstruction: [
            // 0
            new DialogBubble(papa,
                "Hey son, glad you're here with me. Now, do you remember everything I've taught you about hunting?"),
            // 1
            new DecisionBubble("Papa Chad", "Do you remember what I've taught you?", [
                new Choice("Why don't you remind me?", 2),
                new Choice("Of course! No need to repeat yourself.", 4)
            ]),
            // 2
            new DialogBubble(papa,
                "You should use your slingshot to shoot at the bunnies from a diatance! Get too close, and you'll scare them. If you see any snakes, you should use your sword! They're too quick to shoot at."),
            // 3
            new DialogBubble(none,
                "Left click your mouse to use your slingshot. Right click to use your sword."),
            // 4
            new DialogBubble(papa,
                "Come talk to me after you've killed one of each: a snake and a bunny.",
                true,
                () => {
                    STORY.huntingInstructionsReceived = true;
                })
        ],
        huntingInstructionShort: [
            new DialogBubble(papa,
                "Come talk to me after you've killed one of each: a snake and a bunny."),
            new DialogBubble(none,
                "Left click your mouse to use your slingshot. Right click to use your sword.")
        ],
        endOfHunt: [
            new DialogBubble(papa,
                "Fantastic work son! Now, run these back over to Mama Chad so she can whip us up some nourishing MEAT!"),
            new DialogBubble(papa,
                "I'm gonna stick around here, look for some pretty flowers for Mama, she always loves those."),
            new DialogBubble(chad,
                "Get her the rainbow ones, those are her favorite!",
                true,
                () => {
                    STORY.tutorialComplete = true;
                })
        ]
    };
};

const mayorConversationLoader = () => {
    const chad = DialogBubble.SPEAKERS.CHAD;
    const mayor = DialogBubble.SPEAKERS.MAYOR;

    return {
        hopefulGreeting: [
            // 0
            new DialogBubble(mayor,
                "Good morning Chad! It's a beautiful day outside, wouldn't you say?"),
            // 1
            new DecisionBubble('Mayor', 'Beautiful day isn\'t it?', [
                new Choice('Sure is! Great for swimming', 2),
                new Choice('It would be nicer outside this tiny town.', 6)
            ]),
            // 2
            new DialogBubble(chad,
                "Sure is, and warm! Might head over to the lake and go swimming!"),
            // 3
            new DialogBubble(mayor,
                "Maybe wait a bit before doing that. I know it doesn't look it, but I sense there will be a storm. There's a strange chill in the air tonight."),
            // 4
            new DialogBubble(mayor,
                "Years of worrying for the people of this town have given me a sense for these things, but they've also made me a bit paranoid."),
            // 5
            new DialogBubble(mayor,
                "But don't let my nerves spoil your fun. The carelessness of youth is a special thing. It escapes from you all too quickly.",
                true),
            // 6
            new DialogBubble(chad,
                "It's nice, sure, but I wonder what it would look like outside this tiny village. I'm dying to get out and explore."),
            // 7
            new DialogBubble(mayor,
                "That feeling is inevitable. There is indeed a lot to see outside of this \"tiny village\". All of us here have had our time outside the boundaries of this peaceful burg."),
            // 8
            new DialogBubble(mayor,
                "Maybe I'm biased, as mayor of this fine village, but my days on the outside have made me all the more grateful for the tranquility of this region."),
            // 9
            new DialogBubble(mayor,
                "I guess all I'm trying to say is, your time will come, Chad, but you shouldn't be too anxious to escape."),
            // 10
            new DialogBubble(mayor,
                "The carelessness of youth is a special thing, and it has a way of escaping from you way too quickly out there."),
            // 11
            new DialogBubble(mayor,
                "But I'll tell ya Chad, when that day does come and you're ready to set out on some great adventure into the unknown, stop by and talk to me first. I may have something to share with you that could help you along the way.",
                true)
        ]
    };
};

const blacksmithConversationLoader = () => {
    const chad = DialogBubble.SPEAKERS.CHAD;
    const bs = DialogBubble.SPEAKERS.BLACKSMITH;
    return {
        merchant: [
            // 0
            new DialogBubble(bs,
                "Hello."),
            // 1
            new DecisionBubble('Blacksmith', 'Hello.', [
                new Choice('I\'d like to see what you have for sale.', 2),
                new Choice('Leave.', 7)
            ]),
            // 2
            new DialogBubble(bs, 'Okay.'),
            // 3
            new DecisionBubble('Blacksmith', 'Okay', [
                new Choice("Rock ammo (25 for 25 runes)", () => {
                    return INVENTORY.runes >= 25 ? 4 : 9;
                }),
                new Choice("Rock ammo (100 for 100 runes)", () => {
                    return INVENTORY.runes >= 100 ? 5 : 9;
                }),
                new Choice("Bomb ammo (5 for 50 runes)", () => {
                    return INVENTORY.runes >= 50 ? 6 : 9;
                }),
                new Choice('Leave.', 7)
            ]),
            // 4
            new DialogBubble(bs, "Here you go.", true, () => {
                INVENTORY.spendRunes(25);
                INVENTORY.adjustAmmo(AmmoItem.ROCK, 25);
            }),
            // 5
            new DialogBubble(bs, "Here you go.", true, () => {
                INVENTORY.spendRunes(100);
                INVENTORY.adjustAmmo(AmmoItem.ROCK, 100);
            }),
            // 6
            new DialogBubble(bs, "Here you go.", true, () => {
                INVENTORY.spendRunes(50);
                INVENTORY.adjustAmmo(AmmoItem.BOMB, 5);
            }),
            // 7
            new DialogBubble(chad, "See ya!"),
            // 8
            new DialogBubble(bs, "mmhm...", true),
            // 9
            new DialogBubble(bs, "Gonna need more than that.", true)
        ]
    };
}

const mamaChadConversationLoader = () => {
    const mama = DialogBubble.SPEAKERS.MAMA_CHAD;
    const chad = DialogBubble.SPEAKERS.CHAD;
    return {
        goodMorning: [
            // 0
            new DialogBubble(mama,
                "Good morning Chad! I do hope you're careful out there hunting with your father."),
            // 1
            new DialogBubble(mama,
                "I know it's just bunnies and snakes out there, but I always worry you'll run into something more dangerous."),
            // 2
            new DialogBubble(mama,
                "There's a lot of scary things out there in the world."),
            // 3
            new DecisionBubble('Mama Chad', "There's a lot of scary things out there.", [
                new Choice("I'll be careful", 4),
                new Choice("I can handle myself!", 6)]),
            // 4
            new DialogBubble(chad,
                "Of course I'll be careful mama. Gotta make sure I make it back to have some of that MEAT! you cook up!"),
            // 5
            new DialogBubble(mama,
                "Whatever motivates you to stay safe honey. Maybe tonight I'll make your favorite - Burgers! I love you honey.", true),
            // 6
            new DialogBubble(chad,
                "I can handle myself out there! Ain't nothing in these fields that I couldn't fight!"),
            // 7
            new DialogBubble(mama,
                "You're a strong young man, I probably shouldn't be worried. But you'll always be my little boy!"),
            // 8
            new DialogBubble(chad,
                "Aww, stop mama! I gotta go!"),
            // 9
            new DialogBubble(mama,
                "I love you son!"),
            // 10
            new DialogBubble(chad,
                "I love you too mom.", true)
        ]
    };
};

const minerConversationLoader = () => {
    const miner = DialogBubble.SPEAKERS.Miner;
    const chad = DialogBubble.SPEAKERS.CHAD;
    const none = DialogBubble.SPEAKERS.NONE;

    return {
        greeting: [
            // 0
            new DialogBubble(miner,
                "Hey! I'm The Riddlemeister Miner. I haven't seen anybody down here in ages. I've just been mining my own business down here. Haha. I work on puzzles in my spare time..."),
            // 1
            new DecisionBubble('The Riddlemeister Miner', "Wanna try and solve it?", [
                new Choice("Sure thing!", 2),
                new Choice("Thanks, maybe later.", 7)]),
            // 2
            new DialogBubble(chad,
                "That sounds amazing! I'm always up for a good challenge! How do I start?"),
            // 3
            new DialogBubble(miner,
                "It starts with a riddle. When you solve the puzzle in the caves you'll find the answer to the riddle. Come back and answer the riddle when you solve it."),
            // 4
            new DialogBubble(miner,
                "\"the type of letters your write will guide you through the dark, continue with Might and five will follow.\""),
            // 5
            new DialogBubble(miner,
                "When you solve it, come back here and write the answer..."),
            // 6
            new DialogBubble(none,
                "Type your response here. It will not be displayed, you will know if it is correct.\n*Allow Popups on your browser.*", true),
            // 7
            new DialogBubble(chad,
                "That sounds fun but I've got adventuring to do. Let me get back to you on that!", true),

        ]
    };
};

const wizardConversationLoader = () => {
    const wiz = DialogBubble.SPEAKERS.WIZARD;
    const chad = DialogBubble.SPEAKERS.CHAD;
    const none = DialogBubble.SPEAKERS.NONE;
    return {
        threateningIntroduction: [
            new DialogBubble(wiz, 
                "Stop right there, boy!"),
            new DialogBubble(wiz,
                "You've gotten lucky facing my army of slime. Do not spoil your luck now by trying anything stupid."),
            new DialogBubble(chad,
                "What have you done to my Mama?! I'll make you pay for this you zombie looking freak!"),
            new DialogBubble(wiz,
                "Well, child, you're gonna have to try a lot harder than that! We're out of here!",
                false,
                () => {
                    STORY.villageAttackEnded = true;
                    // Unlock all borders in the current zone.
                    GAME.entities.midground.forEach((entity) => {
                        if (entity instanceof Border) {
                            entity.locked = false;
                        }
                    });
                }),
            new DialogBubble(none,
                "The rest of the world has opened up to explore! The evil wizard must have run off somewhere to the east!",
                true)
        ]
    }
}