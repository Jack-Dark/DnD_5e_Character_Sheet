characterClass.rogue = {
	savingThrowProficiencies: {
		stat: 'dexterity',
		stat: 'intelligence'
	},
	levelRewards: {
		'_1': [
			{
				title: 'Expertise',
				description: [
					'Choose two of your skill proficiencies, or one of your skill proficiencies and your proficiency with thieves’ tools. Your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies.'
				]
			},
			{
				title: 'Sneak Attack',
				description: [
					'You know how to strike subtly and exploit a foe’s distraction. Once per turn, you can deal an extra 1d6 damage to one creature you hit with an attack if you have advantage on the attack roll. The attack must use a finesse or a ranged weapon.',
					'You don’t need advantage on the attack roll if another enemy of the target is within 5 feet of it, that enemy isn’t incapacitated, and you don’t have disadvantage on the attack roll.',
					'The amount of the extra damage increases as you gain levels in this class, as shown in the Sneak Attack column of the Rogue table.'
				]
			},
			{
				title: 'Thieves’ Cant',
				description: [
					'During your rogue training you learned thieves’ cant, a secret mix of dialect, jargon, and code that allows you to hide messages in seemingly normal conversation. Only another creature that knows thieves’ cant understands such messages. It takes four times longer to convey such a message than it does to speak the same idea plainly.',
					'In addition, you understand a set of secret signs and symbols used to convey short, simple messages, such as whether an area is dangerous or the territory of a thieves’ guild, whether loot is nearby, or whether the people in an area are easy marks or will provide a safe house for thieves on the run.'
				]
			}
		],
		'_2': [
			{
				title: 'Cunning Action',
				description: [
					'Your quick thinking and agility allow you to move and act quickly. You can take a bonus action on each of your turns in combat. This action can be used only to take the Dash, Disengage, or Hide action.'
				]
			}
		],
		'_3': [
			{
				title: 'Roguish Archetype',
				description: [
					'You choose an archetype that you emulate in the exercise of your rogue abilities: Thief, Assassin, or Arcane Trickster, all detailed at the end of the class description. Your archetype choice grants you features at 3rd level and then again at 9th, 13th, and 17th level.'
				]
			}
		],
		'_4': [
			{
				title: 'Ability Score Improvement',
				description: [
					'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can’t increase an ability score above 20 using this feature. Alternatively, you can instead choose a character feat.'
				]
			}
		],
		'_5': [
			{
				title: 'Uncanny Dodge',
				description: [
					'When an attacker that you can see hits you with an attack, you can use your reaction to halve the attack’s damage against you.'
				]
			}
		],
		'_6': [
			{
				title: 'Expertise',
				description: [
					'Choose two of your skill proficiencies, or one of your skill proficiencies and your proficiency with thieves’ tools. Your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies.'
				]
			}
		],
		'_7': [
			{
				title: 'Evasion',
				description: [
					'You can nimbly dodge out of the way of certain area effects, such as a red dragon’s fiery breath or an ice storm spell. When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw, and only half damage if you fail.'
				]
			}
		],
		'_8': [
			{
				title: 'Ability Score Improvement',
				description: [
					'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can’t increase an ability score above 20 using this feature. Alternatively, you can instead choose a character feat.'
				]
			}
		],
		'_10': [
			{
				title: 'Ability Score Improvement',
				description: [
					'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can’t increase an ability score above 20 using this feature. Alternatively, you can instead choose a character feat.'
				]
			}
		],
		'_11': [
			{
				title: 'Reliable Talent',
				description: [
					'You have refined your chosen skills until they approach perfection. Whenever you make an ability check that lets you add your proficiency bonus, you can treat a d20 roll of 9 or lower as a 10.'
				]
			}
		],
		'_12': [
			{
				title: 'Ability Score Improvement',
				description: [
					'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can’t increase an ability score above 20 using this feature. Alternatively, you can instead choose a character feat.'
				]
			}
		],
		'_14': [
			{
				title: 'Blindsense',
				description: [
					'If you are able to hear, you are aware of the location of any hidden or invisible creature within 10 feet of you.'
				]
			}
		],
		'_15': [
			{
				title: 'Slippery Mind',
				description: [
					'You have acquired greater mental strength. You gain proficiency in Wisdom saving throws.'
				]
			}
		],
		'_16': [
			{
				title: 'Ability Score Improvement',
				description: [
					'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can’t increase an ability score above 20 using this feature. Alternatively, you can instead choose a character feat.'
				]
			}
		],
		'_18': [
			{
				title: 'Elusive',
				description: [
					'You are so evasive that attackers rarely gain the upper hand against you. No attack roll has advantage against you while you aren’t incapacitated.'
				]
			}
		],
		'_19': [
			{
				title: 'Ability Score Improvement',
				description: [
					'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can’t increase an ability score above 20 using this feature. Alternatively, you can instead choose a character feat.'
				]
			}
		],
		'_20': [
			{
				title: 'Stroke of Luck',
				description: [
					'You have an uncanny knack for succeeding when you need to. If your attack misses a target within range, you can turn the miss into a hit. Alternatively, if you fail an ability check, you can treat the d20 roll as a 20. Once you use this feature, you can’t use it again until you finish a short or long rest.'
				]
			}
		]
	}
};

function listAvailableLevelRewards(currentLevel) {
	var levelRewardsContainer = document.querySelector('.character-level-rewards');
	clearCurrentLevelRewards(levelRewardsContainer);
	for (characterLevel = 1; characterLevel <= currentLevel; characterLevel++) {
		var levelRewardWrapper = document.createElement('div');
		var levelRewardWrapperClass = 'level-reward-wrapper level-' + characterLevel + '-reward-wrapper';
			levelRewardWrapper.setAttribute('class', levelRewardWrapperClass);
		var levelRewardsVariable = 'characterClass.' + character.class + '.levelRewards._' + characterLevel;
		if (eval(levelRewardsVariable)) {
			levelRewardsContainer.appendChild(levelRewardWrapper,);
			listAllRewardsAtLevel (levelRewardsVariable, levelRewardWrapper);
		}
	}
}
function clearCurrentLevelRewards(levelRewardsContainer) {
	// var levelRewardsContainer = document.querySelector('.character-level-rewards');
	levelRewardsContainer.innerHTML = '';
}
function listAllRewardsAtLevel(levelRewardsVariable, levelRewardWrapper) {
	var rewardInfo = '';
	for (numberOfLevelRewards = 0; numberOfLevelRewards <= eval(levelRewardsVariable).length - 1; numberOfLevelRewards++) {
		var eachReward = levelRewardsVariable + '[' + numberOfLevelRewards + ']';
		var rewardTitle = eval(eachReward + '.title');
		var rewardTitleHtml = createInnerHtmlString('h4', 'class', 'level-reward-title', rewardTitle);
		var rewardDescription = eval(eachReward + '.description');
		var rewardDescriptionHtml = createDescriptionParagraphs(rewardDescription);
		rewardInfo += rewardTitleHtml + rewardDescriptionHtml;
		if (numberOfLevelRewards == (eval(levelRewardsVariable).length - 1)) {
			levelRewardWrapper.innerHTML = rewardInfo;
		}
	}
}
function createDescriptionParagraphs(rewardDescription) {
	var rewardDescriptionHtml = '';
	for (numberOfDescriptionLines = 0; numberOfDescriptionLines < rewardDescription.length; numberOfDescriptionLines++) {
		var descriptionParagraph = rewardDescription[numberOfDescriptionLines];
		var rewardDescriptionParagraphHtml = createInnerHtmlString('p', 'class', 'level-reward-description', descriptionParagraph);
		rewardDescriptionHtml += rewardDescriptionParagraphHtml;
		if (numberOfDescriptionLines == rewardDescription.length - 1) {
			return rewardDescriptionHtml
		}
	}
}
