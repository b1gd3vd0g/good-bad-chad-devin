const endConversationLoader = () => {
  return {
      wizard: wizardConversationLoaderEnd(),
      mama: mamaConversationLoaderEnd()
  };
};

const wizardConversationLoaderEnd = () => {
  const chad = DialogBubble.SPEAKERS.CHAD;
  const wizard = DialogBubble.SPEAKERS.WIZARD;
  const none = DialogBubble.SPEAKERS.NONE;

  return {
    victory: [
      // 0
      new DialogBubble(wizard,
        "What?!? How did you defeat my robot horde?!", false, () => {
            ASSET_MGR.stopAudio(SFX.PORTAL_IDLE.path);
            STORY.ending = true;
            STORY.tutorialComplete = true; // temp
            CHAD.statusEffect.apply(StatusEffect.INVINCIBLE);
            for (let entity of GAME.entities.midground) {
              if (entity.base && entity.base.isEnemy) {
                  entity.removeFromWorld = true;
              }
            }
          }),
          // 1
          new DialogBubble(chad,
              "Your puny minions are no match for the power of CHAD, evil wizard!"),
          // 2
          new DialogBubble(wizard,
              "I should have known..."),
          // 3
          new DialogBubble(wizard,
            "I wish I had more robots :(", false, () => {
            ASSET_MGR.playSFX(SFX.EVIL_LAUGH.path, SFX.EVIL_LAUGH.volume);
            }),
          // 4
          new DialogBubble(none,
            "Congratulations! You defeated the wizard and won the game.")
      ]
  };
};

const mamaConversationLoaderEnd = () => {
  const mama = DialogBubble.SPEAKERS.MAMA_CHAD;
  const chad = DialogBubble.SPEAKERS.CHAD;
  const wiz = DialogBubble.SPEAKERS.WIZARD;
  return {
    thanks: [
      new DialogBubble(mama,
        "Oh my, where am I? What's going on? Chad? Oh heavens, Chad, are you alright?!"),
      new DialogBubble(chad,
        "I'm okay mama, are you?! I've come a long way to save you from this horrible wizard."),
      new DialogBubble(wiz,
        "Fool! You know nothing of my motives. I am the greatest conjurer this plane has ever seen!", false, () => {
            ASSET_MGR.playSFX(SFX.EVIL_LAUGH.path, SFX.EVIL_LAUGH.volume);
            }),
      new DialogBubble(chad,
        "Nor do I care, beast! I'm sick of you!",
        false,
        () => {
          CHAD.action = "dashing";
          GAME.entities.midground.forEach((entity) => {
            if (entity instanceof Wizard) {
              entity.pos = Vector.add(entity.pos, new Vector(250, 0));
            }
          });
        }),
      new DialogBubble(chad,
        "Let's get outta here mama. All this adventuring just makes me wanna go home.",
        true,
        () => {
          setTimeout(() => {
            ASSET_MGR.stopAudio(SFX.PORTAL_IDLE.path);
            // teleport back to home
            LAST_ZONE = null;
            ZONE = Zone.getZones().village.main;
            SAVED_ZONE = ZONE;
            ZONE.load();
            CHAD.statusEffect.clearEffects();
          }, 1000);
        })
    ]
  }
}