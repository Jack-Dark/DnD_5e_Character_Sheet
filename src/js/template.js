const character = {
	race: '',
	class: '',
	level: 1,
	inspiration: 0,
	proficiencyBonus: 0,
	stats: {
		strength: {
			score: 0,
			modifier: 0,
			skills: {
				athletics: {
					expertise: false,
					proficiency: false,
					modifier: 0
				}
			}
		},
		dexterity: {
			score: 0,
			modifier: 0,
			skills: {
				acrobatics: {
					expertise: false,
					proficiency: false,
					modifier: 0
				},
				sleightOfHand: {
					expertise: false,
					proficiency: false,
					modifier: 0
				},
				stealth: {
					expertise: false,
					proficiency: false,
					modifier: 0
				}
			}
		},
		constitution: {
			score: 0,
			modifier: 0
		},
		intelligence: {
			score: 0,
			modifier: 0,
			skills: {
				arcana: {
					expertise: false,
					proficiency: false,
					modifier: 0
				},
				history: {
					expertise: false,
					proficiency: false,
					modifier: 0
				},
				investigation: {
					expertise: false,
					proficiency: false,
					modifier: 0
				},
				nature: {
					expertise: false,
					proficiency: false,
					modifier: 0
				},
				religion: {
					expertise: false,
					proficiency: false,
					modifier: 0
				}
			}
		},
		wisdom: {
			score: 0,
			modifier: 0,
			skills: {
				animalHandling: {
					expertise: false,
					proficiency: false,
					modifier: 0
				},
				insight: {
					expertise: false,
					proficiency: false,
					modifier: 0
				},
				medicine: {
					expertise: false,
					proficiency: false,
					modifier: 0
				},
				perception: {
					expertise: false,
					proficiency: false,
					modifier: 0
				},
				survival: {
					expertise: false,
					proficiency: false,
					modifier: 0
				}
			}
		},
		charisma: {
			score: 0,
			modifier: 0,
			skills: {
				deception: {
					expertise: false,
					proficiency: false,
					modifier: 0
				},
				intimidation: {
					expertise: false,
					proficiency: false,
					modifier: 0
				},
				performance: {
					expertise: false,
					proficiency: false,
					modifier: 0
				},
				persuasion: {
					expertise: false,
					proficiency: false,
					modifier: 0
				}
			}
		}
	}
};
function onDocumentReady(fn) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}
function runDocumentReadyTasks() {
	updateCharacterLevelVariable();
	updateProficiencyBonusVariable();
	// character.proficiencyBonus = document.querySelector('#input__proficiency-bonus').getAttribute('value');
	forEachStat(updateCharacterStatsVariables);
	forEachStat(updateCharacterSkillsVariables);
	forEachStat(injectCharacterJsonIntoPage);
	console.log(character.proficiencyBonus);
}
function camelizeString(string) {
	return string.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
		return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
	}).replace(/\s+/g, '');
}
function camelizeHyphenatedString(string) {
	return string.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
		return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
	}).replace(/[-]+/g, '');
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
		checkProficiencyIfExpertiseIsChecked(skillHasExpertise, skillProficiencyInput);
		enableProficiencyInputIfExpertiseIsUnchecked(skillHasExpertise, skillProficiencyInput);
		updateCharacterSkillExpertiseVariable(characterSkillVariable, skillHasExpertise);
		updateCharacterSkillProficiencyVariable(characterSkillVariable, skillHasProficiency);
		updateCharacterSkillModifierVariable(characterSkillVariable, skillHasExpertise, skillHasProficiency, statModifier);
	}
}
function checkProficiencyIfExpertiseIsChecked(skillHasExpertise, skillProficiencyInput) {
	if (skillHasExpertise) {
		skillProficiencyInput.checked = true;
		skillProficiencyInput.disabled = true;
	}
}
function enableProficiencyInputIfExpertiseIsUnchecked(skillHasExpertise, skillProficiencyInput) {
	if (!skillHasExpertise) {
		skillProficiencyInput.removeAttribute('disabled');
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