function onDocumentReady(fn) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}
function runDocumentReadyTasks() {
	updateCharacterJsonVariables();
	forEachStat(injectCharacterJsonIntoPage);
}
function createInnerHtmlString(element, attribute, attributeValue, contents) {
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
function updateCharacterJsonVariables() {
	updateCharacterRaceVariable();
	updateCharacterClasssVariable();
	updateCharacterLevelVariable();
	updateProficiencyBonusVariable();
	forEachStat(toggleDependentProficiencies);
	forEachStat(updateCharacterStatsVariables);
	forEachStat(updateCharacterSkillsVariables);
	listAvailableLevelRewards(character.level);
	// console.log(character);
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
function updateProficiencyBonusVariable() {
	var characterLevel = character.level;
	var proficiencyBonus = 2;
	var characterLevelIntervalsForProficiencyIncrease = [1, 5, 9, 13, 17, 21];
	var characterLevelProficiencyIncreaseScore = [2, 3, 4, 5, 6];
	for (characterLevelInterval = 0; characterLevelInterval <= characterLevelIntervalsForProficiencyIncrease.length; characterLevelInterval = (characterLevelInterval + 1)) {
		if (characterLevel >= characterLevelIntervalsForProficiencyIncrease[characterLevelInterval] &&  characterLevel < characterLevelIntervalsForProficiencyIncrease[(characterLevelInterval + 1)]) {
			return character.proficiencyBonus = characterLevelProficiencyIncreaseScore[characterLevelInterval];
		}
	}
}
function forEachStat(fn) {
	var statBlock = document.querySelectorAll('.stat');
	for (occuranceOfStatBlock = 0; occuranceOfStatBlock < statBlock.length; occuranceOfStatBlock++) {
		var thisStatBlockElement = statBlock[occuranceOfStatBlock];
		var thisStatType = thisStatBlockElement.getAttribute('data-stat-type');
		var thisStatValue = Number(thisStatBlockElement.querySelector('.stat__value').value);
		var thisStatModifier = calculateStatModifier(thisStatValue);
		fn(thisStatBlockElement, thisStatType, thisStatValue, thisStatModifier);
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
function updateCharacterStatsVariables(statBlockElement, statType, statScore, statModifier) {
	updateCharacterStatScoreVariable(statType, statScore);
	updateCharacterStatModifierVariable(statType, statModifier);
}
function updateCharacterStatScoreVariable(statType, statScore) {
	return eval('character.stats.' + statType + '.score = statScore');
}
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




onDocumentReady(runDocumentReadyTasks);