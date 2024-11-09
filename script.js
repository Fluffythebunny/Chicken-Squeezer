let squeakCount = 0;
let audio = new Audio('squeek.mp3');
let multiplier = 1;
let autoSqueezeInterval = null;

const upgrades = {
    goldenChicken: { 
        cost: 5000, 
        owned: false,
        originalCost: 5000
    },
    autoSqueezer: { 
        cost: 50, 
        owned: false,
        originalCost: 50,
        level: 0
    },
    multiSqueezer: { 
        cost: 75, 
        owned: false,
        originalCost: 75,
        level: 0
    }
};

  const achievements = [
      { 
          name: 'Squeaky Starter', 
          threshold: 10, 
          description: 'Your first steps into the world of chicken squeezing!' 
      },
      { 
          name: 'Chicken Whisperer', 
          threshold: 50, 
          description: 'You\'re developing a special bond with rubber chickens!' 
      },
      { 
          name: 'Squeak Master', 
          threshold: 100, 
          description: 'Your squeezing skills are becoming legendary!' 
      },
      { 
          name: 'Chicken Legend', 
          threshold: 250, 
          description: 'The rubber chicken community bows to your expertise!' 
      },
      { 
          name: 'Rubber Chicken Guru', 
          threshold: 500, 
          description: 'You are the ultimate chicken squeezing champion!' 
      },
      { 
        name: 'Chicken King', 
        threshold: 1000, 
        description: 'The rubber chicken community bows down to your royal highness!' 
      },
      { 
        name: 'Chicken God', 
        threshold: 5000, 
        description: 'The rubber chicken Worships you!' 
    }
  ];

  const unlockedAchievements = new Set();

  function showAchievement(achievement) {
      const existingPopup = document.querySelector('.achievement-popup');
      if (existingPopup) {
          achievementPopup.classList.add('pop-out');
          existingPopup.remove();
      }

      const achievementPopup = document.createElement('div');
      achievementPopup.className = 'achievement-popup';
      achievementPopup.innerHTML = `
          <h3>Achievement Unlocked!</h3>
          <h4>${achievement.name}</h4>
          <p>${achievement.description}</p>
      `;
      document.body.appendChild(achievementPopup);
      achievementPopup.offsetWidth;
      achievementPopup.classList.add('pop-in');
      setTimeout(() => {;
          setTimeout(() => {
              achievementPopup.remove();
          }, 500);
      }, 3000);
  }

  function checkAchievements() {
      achievements.forEach(achievement => {
          if (squeakCount >= achievement.threshold && !unlockedAchievements.has(achievement.name)) {
              showAchievement(achievement);
              unlockedAchievements.add(achievement.name);
          }
      });
  }
  function getRandomPitch() {
    return 0.5 + Math.random() * 1.5;
}

function squeezeChicken() {
    squeakCount += multiplier;

    document.querySelector('.squeak-counter').textContent = `Squeaks: ${squeakCount}`;

    document.querySelector('.chicken').style.transform = 'scale(0.9)';

    document.querySelector('.meter-fill').style.width = `${(squeakCount % 10) * 10}%`;
   
    audio.preservesPitch = false;
    audio.playbackRate = getRandomPitch();
    audio.currentTime = 0;
    audio.play();
   
    checkAchievements();

    setTimeout(() => {
        document.querySelector('.chicken').style.transform = 'scale(1)';
    }, 200);
}

function buyUpgrade(type) {
    const upgrade = upgrades[type];

    if (squeakCount >= upgrade.cost) {
        squeakCount -= upgrade.cost;

        switch(type) {
            case 'goldenChicken':
                if (!upgrade.owned) {
                    document.querySelector('.chicken').classList.add('golden');
                    multiplier = 2;
                    upgrade.owned = true;
                    document.querySelector(`[data-upgrade="${type}"]`).innerHTML = 
                        `Golden Chicken (Owned)`;
                }
                break;
            
            case 'autoSqueezer':
                upgrade.level++;
                if (autoSqueezeInterval) {
                    clearInterval(autoSqueezeInterval);
                }
                autoSqueezeInterval = setInterval(squeezeChicken, 2000);
                upgrade.cost = Math.ceil(upgrade.originalCost * Math.pow(1.5, upgrade.level));
                document.querySelector(`[data-upgrade="${type}"]`).innerHTML = 
                    `Auto Squeezer (Level ${upgrade.level}) - Next: ${upgrade.cost} squeaks`;
                break;
            
            case 'multiSqueezer':
                upgrade.level++;
                multiplier *= 2;
                upgrade.cost = Math.ceil(upgrade.originalCost * Math.pow(1.5, upgrade.level));
                document.querySelector(`[data-upgrade="${type}"]`).innerHTML = 
                    `Multi Squeezer (Level ${upgrade.level}) - Next: ${upgrade.cost} squeaks`;
                break;
        }
       
        document.querySelector('.squeak-counter').textContent = `Squeaks: ${squeakCount}`;
    }
}

function resetCounter() {
    squeakCount = 0;
    document.querySelector('.squeak-counter').textContent = 'Squeaks: 0';
    document.querySelector('.meter-fill').style.width = '0%';
}

window.addEventListener('load', () => {
  loadSavedData();
});

window.addEventListener('beforeunload', () => {
  saveData();
});

function loadSavedData() {
  const savedSqueakCount = localStorage.getItem('squeakCount');
  if (savedSqueakCount !== null) {
    squeakCount = parseInt(savedSqueakCount);
    document.querySelector('.squeak-counter').textContent = `Squeaks: ${squeakCount}`;
  }

  const savedUpgrades = localStorage.getItem('upgrades');
  if (savedUpgrades !== null) {
    const parsedUpgrades = JSON.parse(savedUpgrades);
    Object.keys(upgrades).forEach((key) => {
      upgrades[key].owned = parsedUpgrades[key].owned;
      upgrades[key].level = parsedUpgrades[key].level;
      updateUpgradeUI(key);
    });
  }

  const savedAchievements = localStorage.getItem('unlockedAchievements');
  if (savedAchievements !== null) {
    const parsedAchievements = JSON.parse(savedAchievements);
    parsedAchievements.forEach((achievement) => {
      unlockedAchievements.add(achievement);
    });
  }
}

function saveData() {
  localStorage.setItem('squeakCount', squeakCount);
  localStorage.setItem('upgrades', JSON.stringify(upgrades));
  localStorage.setItem('unlockedAchievements', JSON.stringify(Array.from(unlockedAchievements)));
}

function updateUpgradeUI(type) {
  const upgrade = upgrades[type];
  const upgradeElement = document.querySelector(`[data-upgrade="${type}"]`);

  if (upgrade.owned) {
    upgradeElement.innerHTML = `${type.charAt(0).toUpperCase() + type.slice(1)} (Owned)`;
  } else {
    upgradeElement.innerHTML = `${type.charAt(0).toUpperCase() + type.slice(1)} - ${upgrade.cost} squeaks`;
  }

  if (type === 'autoSqueezer') {
    upgradeElement.innerHTML = `Auto Squeezer (Level ${upgrade.level}) - Next: ${upgrade.cost} squeaks`;
  } else if (type === 'multiSqueezer') {
    upgradeElement.innerHTML = `Multi Squeezer (Level ${upgrade.level}) - Next: ${upgrade.cost} squeaks`;
  }
}
