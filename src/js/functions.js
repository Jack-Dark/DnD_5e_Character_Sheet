onDocumentReady(runDocumentReadyTasks);

function onDocumentReady(fn) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}
function runDocumentReadyTasks() {
	updateCharacterJsonVariables();
	// forEachStatRunFunction(injectCharacterJsonIntoPage, options);
}

// GLOBAL FUNCTIONS
// ================

function createInnerHtmlString(element, contents, attribute, attributeValue) {
	return '<' + element + ' ' + attribute + '="' + attributeValue + '">' + contents + '</' + element + '>'
}
function camelizeString(string) {
	return string.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
		return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
	}).replace(/\s+/g, '');
}
function camelizeHyphenatedString(string) {
	return string.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
		return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
	}).replace(/[-]+/g, '').replace(/\s+/g, '');
}
// combine camelize functions with `.replace(/[\s-]+/g, '');` ?

function parseUrlSearchIntoJson() { // come back to this to run first on document ready.
  var query = location.search.substr(1);
  var result = {};
  query.split("&").forEach(function(part) {
    var item = part.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  });
  console.log(result);
  return result;
}
function updateURL(parsedJson) {
  if (history.pushState) {
      var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + parsedJson;
      window.history.pushState({path:newurl},'',newurl);
  }
}
function updateCharacterJsonVariables() {
	updateCharacterRaceVariable();
	updateCharacterClasssVariable();
	updateCharacterLevelVariable();
	toggleSubclassVisibility();
	listAvailableLevelRewards();
	createCharacterStatsVariable();
	forEachStatRunFunction(createSpecificCharacterStatsVariables);
	forEachSkillRunFunction(createCharacterSkillsVariable);
	forEachSkillRunFunction(createSpecificCharacterSkillsVariables);
	// forEachSkillOfStatTypeRunfunction(statType, updateCharacterSkillsVariables);
	// updateProficiencyBonusVariable();
	// forEachStatRunFunction(toggleDependentProficiencies, options);
	console.log(character.stats.dexterity);
}
function updateCharacterRaceVariable() {
	return character.race = camelizeHyphenatedString(document.querySelector('#character--race').value.toLowerCase());
}
function updateCharacterClasssVariable() {
	return character.class = document.querySelector('#character--class').value.toLowerCase();
}
function updateCharacterLevelVariable() {
	return character.level = document.querySelector('#character--level').value;
}

// SUBCLASSES
// ==========

function toggleSubclassVisibility() {
	toggleSubclassOptions();
	toggleSubclassMenu();
	updateCharacterSubclassVariable();
}
function toggleSubclassMenu() {
	var subclassAvailableAtLevel = eval('characterClass.' + character.class + '.subclassAvailableAtLevel');
	var subclassElementWrapper = document.querySelector('.character--subclass-wrapper');
	if (character.level >= subclassAvailableAtLevel) {
		subclassElementWrapper.classList.remove('hidden');
	} else {
		subclassElementWrapper.classList.add('hidden');
	}
}
function updateCharacterSubclassVariable() {
	var selectedSubclass = document.querySelector('#character--subclass').value.toLowerCase();
	return character.subclass = selectedSubclass;
}
function toggleSubclassOptions() {
	var allSubclassOptions = document.querySelectorAll('.character--subclass__option');
	for (subclassOption = 0; subclassOption < allSubclassOptions.length; subclassOption++) {
		var thisSubclass = allSubclassOptions[subclassOption];
		var subclassOfClass = thisSubclass.getAttribute('data-character-class').toLowerCase();
		if (character.class == subclassOfClass) {
			thisSubclass.classList.remove('hidden');
		}
	}
}

// LEVEL REWARDS
// =============

function listAvailableLevelRewards() {
	var levelRewardsContainer = document.querySelector('.character-level-rewards');
	clearCurrentLevelRewards(levelRewardsContainer);
	for (characterLevel = 1; characterLevel <= character.level; characterLevel++) {
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
	levelRewardsContainer.innerHTML = '';
}
function listAllRewardsAtLevel(levelRewardsVariable, levelRewardWrapper) {
	var rewardInfo = '';
	for (numberOfLevelRewards = 0; numberOfLevelRewards < eval(levelRewardsVariable).length; numberOfLevelRewards++) {
		var eachReward = levelRewardsVariable + '[' + numberOfLevelRewards + ']';
		var rewardIsSubclassAbility = eval(eachReward + '.subclassAbility');
		var rewardSubclassName = eval(eachReward + '.subclassName').toLowerCase();
		var rewardTitle = eval(eachReward + '.title');
		var rewardTitleHtml = createInnerHtmlString('h4', rewardTitle, 'class', 'level-reward-title');
		var rewardDescription = eval(eachReward + '.description');
		var rewardDescriptionHtml = createDescriptionParagraphs(rewardDescription);
		if (!rewardIsSubclassAbility || (rewardIsSubclassAbility && rewardSubclassName == character.subclass)) {
			rewardInfo += rewardTitleHtml + rewardDescriptionHtml;
		}
		if (numberOfLevelRewards == (eval(levelRewardsVariable).length - 1)) {
			levelRewardWrapper.innerHTML = rewardInfo;
		}
	}
}
function createDescriptionParagraphs(rewardDescription) {
	var rewardDescriptionHtml = '';
	for (numberOfDescriptionLines = 0; numberOfDescriptionLines < rewardDescription.length; numberOfDescriptionLines++) {
		var descriptionParagraph = rewardDescription[numberOfDescriptionLines];
		var rewardDescriptionParagraphHtml = createInnerHtmlString('p', descriptionParagraph, 'class', 'level-reward-description');
		rewardDescriptionHtml += rewardDescriptionParagraphHtml;
		if (numberOfDescriptionLines == rewardDescription.length - 1) {
			return rewardDescriptionHtml
		}
	}
}

// PROFICIENCY BONUSES
// ===================

function updateProficiencyBonusVariable() {
	var characterLevelIntervalsForProficiencyIncrease = [1, 5, 9, 13, 17, 21];
	var characterLevelProficiencyIncreaseScore = [2, 3, 4, 5, 6];
	for (characterLevelInterval = 0; characterLevelInterval <= characterLevelIntervalsForProficiencyIncrease.length; characterLevelInterval = (characterLevelInterval + 1)) {
		if (character.level >= characterLevelIntervalsForProficiencyIncrease[characterLevelInterval] &&  character.level < characterLevelIntervalsForProficiencyIncrease[(characterLevelInterval + 1)]) {
			return character.proficiencyBonus = characterLevelProficiencyIncreaseScore[characterLevelInterval];
		}
	}
}
function calculateStatModifier(statScore) {
	var statDifferenceHalved = statDifferenceFromTen(statScore)/2;
	return Math.floor(statDifferenceHalved);
}
function statDifferenceFromTen(statScore){
	if (statScore >= 10) {
		return statScore - 10
	} else {
		return (10 - statScore) * -1
	}
}

// CHARACTER STATS
// ===============

function createCharacterStatsVariable() {
	return character.stats = {};
}
function forEachStatRunFunction(fn, options) {
	var statBlocks = document.querySelectorAll('.character--stat');
	for (occuranceOfStatBlock = 0; occuranceOfStatBlock < statBlocks.length; occuranceOfStatBlock++) {
		var thisStatBlockElement = statBlocks[occuranceOfStatBlock];
		var thisStatType = thisStatBlockElement.getAttribute('data-stat-type');
		var thisStatValue = Number(thisStatBlockElement.querySelector('.character--stat__value').value);
		var thisStatModifier = calculateStatModifier(thisStatValue);
		if (options != undefined) {
			// console.log('Running function with passed options.')
			fn(thisStatType, options);
		} else {
			// console.log('Running function by itself.')
			fn(thisStatType);
		}
	}
}
function createSpecificCharacterStatsVariables(statType) {
	// return character.stats.push(statType);
	return eval('character.stats.' + statType + ' = {}');
}
function turnEachStatVariableIntoAnArray(statType) {
	var statIndex = character.stats.indexOf(statType);
	return character.stats[statIndex].push('test');
}
function forEachSkillRunFunction(fn, options) {	
	var skillBlocks = document.querySelectorAll('.character--skill');
	var skillsOfTheSameStat = [];
	for (occuranceOfSkill = 0; occuranceOfSkill < skillBlocks.length; occuranceOfSkill++) {
		var thisSkill = skillBlocks[occuranceOfSkill];
		var thisSkillsStat = thisSkill.getAttribute('data-stat-type');
		// var thisSkillsStatIndex = character.stats.indexOf(thisSkillsStat);
		var skillName = thisSkill.getAttribute('data-skill-name');
		var skillNameCamelized = camelizeHyphenatedString(skillName);
		if (options != undefined) {
			fn(options);
		} else {
			fn(thisSkillsStat, skillNameCamelized);
		}
	}

}
function createCharacterSkillsVariable(statType) {
	return eval('character.stats.' + statType + '.skills = {}');
}
function createSpecificCharacterSkillsVariables(statType, skillNameCamelized) {
	return eval('character.stats.' + statType + '.skills.' + skillNameCamelized + ' = {}');
}
// function createSpecificCharacterSkillsVariables(statBlockElement, statType, statScore, statModifier) {
// 	var skillsOfStatType = document.querySelectorAll('.skill[data-stat-type="' + statType + '"]');
// 	for (occuranceOfskillsOfStatType = 0; occuranceOfskillsOfStatType < skillsOfStatType.length; occuranceOfskillsOfStatType++) {
// 		var thisSkill = skillsOfStatType[occuranceOfskillsOfStatType];
// 		var skillName = thisSkill.getAttribute('data-skill-name');
// 		var skillNameCamelized = camelizeHyphenatedString(skillName);
// 		return eval('character.stats.' + statType + '.skills.' + skillNameCamelized ' = {}');
// 	}
// }
// function createSpecificCharacterSkillsVariables(statBlockElement, statType, statScore, statModifier) {
// 	var skillsOfStatType = document.querySelectorAll('.skill[data-stat-type="' + statType + '"]');
// 	for (occuranceOfskillsOfStatType = 0; occuranceOfskillsOfStatType < skillsOfStatType.length; occuranceOfskillsOfStatType++) {
// 		var thisSkill = skillsOfStatType[occuranceOfskillsOfStatType];
// 		var skillName = thisSkill.getAttribute('data-skill-name');
// 		var skillNameCamelized = camelizeHyphenatedString(skillName);
// 		return eval('character.stats.' + statType + '.skills.' + skillNameCamelized);
// 	}
// }
// function updateCharacterStatScoreVariable(statType, statScore) {
// 	for (occuranceOfskillsOfStatType = 0; occuranceOfskillsOfStatType < skillsOfStatType.length; occuranceOfskillsOfStatType++) {
// 		var thisSkill = skillsOfStatType[occuranceOfskillsOfStatType];
// 		var skillName = thisSkill.getAttribute('data-skill-name');
// 		var skillNameCamelized = camelizeHyphenatedString(skillName);
// 		return eval('character.stats.' + statType + '.score = statScore');
// 	}
// }
function updateCharacterStatModifierVariable(statType, statModifier) {
	return eval('character.stats.' + statType + '.modifier = statModifier');
}
function toggleDependentProficiencies(statBlockElement, statType, statScore, statModifier) {
	var skillsOfStatType = document.querySelectorAll('.skill[data-stat-type="' + statType + '"]');
	for (occuranceOfskillsOfStatType = 0; occuranceOfskillsOfStatType < skillsOfStatType.length; occuranceOfskillsOfStatType++) {
		var thisSkill = skillsOfStatType[occuranceOfskillsOfStatType];
		var skillName = thisSkill.getAttribute('data-skill-name');
		var skillNameCamelized = camelizeHyphenatedString(skillName);
		var skillExpertiseInput = thisSkill.querySelector('.skill__expertise');
		var skillHasExpertise = skillExpertiseInput.checked;
		var skillProficiencyInput = thisSkill.querySelector('.skill__proficiency');
		var skillHasProficiency = skillProficiencyInput.checked;
		var characterSkillVariable = 'character.stats.' + statType + '.skills.' + skillNameCamelized;
		var characterSkillExpertiseVariable = eval(characterSkillVariable + '.expertise');
		var characterSkillProficiencyVariable = eval(characterSkillVariable + '.proficiency');
		uncheckExpertiseInputIfProficiencyIsUnchecked(skillHasExpertise, skillHasProficiency, skillExpertiseInput, characterSkillExpertiseVariable, characterSkillProficiencyVariable);
		checkProficiencyIfExpertiseIsChecked(skillHasExpertise, skillHasProficiency, skillProficiencyInput, characterSkillExpertiseVariable);
	}
}
function uncheckExpertiseInputIfProficiencyIsUnchecked(skillHasExpertise, skillHasProficiency, skillExpertiseInput, characterSkillExpertiseVariable, characterSkillProficiencyVariable) {
	if (skillHasExpertise && !skillHasProficiency && characterSkillExpertiseVariable && characterSkillProficiencyVariable) {
		skillExpertiseInput.checked = false;
		skillExpertiseInput.removeAttribute('checked');
	}
}
function checkProficiencyIfExpertiseIsChecked(skillHasExpertise, skillHasProficiency, skillProficiencyInput, characterSkillExpertiseVariable) {
	if (skillHasExpertise && !skillHasProficiency && !characterSkillExpertiseVariable) {
		skillProficiencyInput.checked = true;
		skillProficiencyInput.setAttribute('checked', '');
	}
}
function updateCharacterSkillsVariables(statBlockElement, statType, statScore, statModifier) {
	var skillsOfStatType = document.querySelectorAll('.skill[data-stat-type="' + statType + '"]');
	for (occuranceOfskillsOfStatType = 0; occuranceOfskillsOfStatType < skillsOfStatType.length; occuranceOfskillsOfStatType++) {
		var thisSkill = skillsOfStatType[occuranceOfskillsOfStatType];
		var skillName = thisSkill.getAttribute('data-skill-name');
		var skillNameCamelized = camelizeHyphenatedString(skillName);
		var skillExpertiseInput = thisSkill.querySelector('.skill__expertise');
		var skillHasExpertise = skillExpertiseInput.checked;
		var skillProficiencyInput = thisSkill.querySelector('.skill__proficiency');
		var skillHasProficiency = skillProficiencyInput.checked;
		var characterSkillVariable = 'character.stats.' + statType + '.skills.' + skillNameCamelized;
		var characterSkillExpertiseVariable = eval(characterSkillVariable + '.expertise');
		var characterSkillProficiencyVariable = eval(characterSkillVariable + '.proficiency');
		updateCharacterSkillExpertiseVariable(characterSkillVariable, skillHasExpertise);
		updateCharacterSkillProficiencyVariable(characterSkillVariable, skillHasProficiency);
		updateCharacterSkillModifierVariable(characterSkillVariable, skillHasExpertise, skillHasProficiency, statModifier);
	}
}
function updateCharacterSkillExpertiseVariable(characterSkillVariable, skillHasExpertise) {
	return eval(characterSkillVariable + '.expertise = ' + skillHasExpertise);
}
function updateCharacterSkillProficiencyVariable(characterSkillVariable, skillHasProficiency) {
	return eval(characterSkillVariable + '.proficiency = ' + skillHasProficiency);
}
function updateCharacterSkillModifierVariable(characterSkillVariable, skillHasExpertise, skillHasProficiency, statModifier) {
	var characterSkillModifierVariable  = characterSkillVariable + '.modifier';
	if (skillHasExpertise) {
		return eval(characterSkillModifierVariable + ' = ' + (character.proficiencyBonus * 2 + statModifier));
	} else if (skillHasProficiency) {
		return eval(characterSkillModifierVariable + ' = ' + (character.proficiencyBonus * 1 + statModifier));
	} else {
		return eval(characterSkillModifierVariable + ' = ' + statModifier);
	}
}
function injectCharacterJsonIntoPage(statBlockElement, statType, statScore, statModifier) {
	injectCharacterProficiencyBonus();
	injectCharacterStatsModifers(statBlockElement, statModifier);
	injectCharacterSkillsModifers(statType);
}
function injectCharacterProficiencyBonus() {
	document.querySelector('#input__proficiency-bonus').value = character.proficiencyBonus;
}
function injectCharacterStatsModifers(statBlockElement, statModifier) {
	statBlockElement.querySelector('input.stat__modifier').value = statModifier;
}
function injectCharacterSkillsModifers(statType) {
	var skillsOfStatType = document.querySelectorAll('.skill[data-stat-type="' + statType + '"]');
	for (occuranceOfskillsOfStatType = 0; occuranceOfskillsOfStatType < skillsOfStatType.length; occuranceOfskillsOfStatType++) {
		var thisSkill = skillsOfStatType[occuranceOfskillsOfStatType];
		var skillName = thisSkill.getAttribute('data-skill-name');
		var skillNameCamelized = camelizeHyphenatedString(skillName);
		var skillModifierInput = thisSkill.querySelector('.skill__modifier');
		var characterSkillModifierVariable = 'character.stats.' + statType + '.skills.' + skillNameCamelized + '.modifier';
		skillModifierInput.value = eval(characterSkillModifierVariable);
	}
}
