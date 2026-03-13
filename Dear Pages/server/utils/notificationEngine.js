const getFlirtyNotification = (bookTitle, borrowerName, relationship) => {
  const notifications = {
    // --- PARENTS ---
    Dad: [
      `👔 The Boss has spoken! Dad took "${bookTitle}". Better not find a coffee stain on it!`,
      `👨‍🏫 Look at Dad acting like a student again with "${bookTitle}". He'll be asleep in 5 mins.`
    ],
    Mom: [
      `❤️ Mom's turn to get inspired! She's officially reading "${bookTitle}" now.`,
      `🤱 Sharing is caring (Mom's rules). "${bookTitle}" is with the Queen today.`
    ],
    // --- SIBLINGS ---
    Sister: [
      `💅 Sibling rivalry? Your sister just swiped "${bookTitle}" for herself.`,
      `🙄 Sister logic: 'What's yours is mine.' She's now the owner of "${bookTitle}" (for now).`
    ],
    Brother: [
      `🎮 Breaking News: Brother actually put down the controller for "${bookTitle}"!`,
      `🥊 Keep an eye on your shelf! Your brother just raided the vault for "${bookTitle}".`
    ],
    // --- ELDERS ---
    Grandfather: [
      `👴 Legend status! Grandpa is diving into "${bookTitle}". Respect the wisdom.`,
      `🕰️ Old school meets new book! Grandpa is currently enjoying "${bookTitle}".`
    ],
    Grandmother: [
      `👵 Grandma's tea time just got better. She’s cozying up with "${bookTitle}".`,
      `🧶 Hand-picked by the best! Grandma has "${bookTitle}" in her hands.`
    ],
    // --- EXTENDED FAMILY ---
    Uncle: [
      `🕶️ The cool uncle alert! He just "borrowed" "${bookTitle}". Let's hope it comes back!`,
      `🍻 Uncle's next big project: Reading "${bookTitle}". (Or at least pretending to).`
    ],
    Aunt: [
      `☕ Auntie's book club just got an upgrade! She's reading "${bookTitle}" now.`,
      `✨ Auntie knows best! She just picked "${bookTitle}" from your vault.`
    ],
    Cousin: [
      `🤜 Cousin vibes! "${bookTitle}" is now with your favorite (or least favorite) cousin.`,
      `🏡 Keeping it in the family! Your cousin just took "${bookTitle}" for a spin.`
    ],
    // --- NEXT GEN ---
    Nephew: [
      `👦 Building the next scholar! Your nephew just grabbed "${bookTitle}".`,
      `🚀 Future genius? Your nephew is busy with "${bookTitle}". Watch out!`
    ],
    Niece: [
      `👧 Niece power! She's exploring "${bookTitle}" today. Keep it safe!`,
      `🍭 Too cute to say no! Your niece is officially reading "${bookTitle}".`
    ],
    // --- FRIENDS & OTHERS ---
    Friend: [
      `😏 Scholar vibes! You just lent "${bookTitle}" to ${borrowerName}. Hope they read it!`,
      `🤝 Trust level 100: ${borrowerName} has your copy of "${bookTitle}".`
    ],
    Waiting: [
      `🥺 I'm lonely! "${bookTitle}" is gathering dust. Read me or I'll haunt you!`,
      `🔥 Hot take: You bought "${bookTitle}" to read it, not just to look at it. Open up!`
    ]
  };

  const pool = notifications[relationship] || [
    `👀 The Vault is open! "${bookTitle}" is now with ${borrowerName}.`
  ];
  return pool[Math.floor(Math.random() * pool.length)];
};

module.exports = { getFlirtyNotification };