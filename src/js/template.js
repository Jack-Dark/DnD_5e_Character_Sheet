const character = {
	race: '',
	class: '',
	inspiration: 0,
	proficiencyBonus: 0,
	stats: {
		strength: {
			score: 0,
			modifier: 0,
			skills: {
				athletics: {
					modifier: 0,
					proficiency: {
						expertise: false,
						proficient: false
					}
				}
			}
		},
		dexterity: {
			score: 0,
			modifier: 0,
			skills: {
				acrobatics: {
					modifier: 0,
					proficiency: {
						expertise: false,
						proficient: false
					}
				},
				sleightOfHand: {
					modifier: 0,
					proficiency: {
						expertise: false,
						proficient: false
					}
				},
				stealth: {
					modifier: 0,
					proficiency: {
						expertise: false,
						proficient: false
					}
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
					modifier: 0,
					proficiency: {
						expertise: false,
						proficient: false
					}
				},
				history: {
					modifier: 0,
					proficiency: {
						expertise: false,
						proficient: false
					}
				},
				investigation: {
					modifier: 0,
					proficiency: {
						expertise: false,
						proficient: false
					}
				},
				nature: {
					modifier: 0,
					proficiency: {
						expertise: false,
						proficient: false
					}
				},
				religion: {
					modifier: 0,
					proficiency: {
						expertise: false,
						proficient: false
					}
				}
			}
		},
		wisdom: {
			score: 0,
			modifier: 0,
			skills: {
				animalHandling: {
					modifier: 0,
					proficiency: {
						expertise: false,
						proficient: false
					}
				},
				insight: {
					modifier: 0,
					proficiency: {
						expertise: false,
						proficient: false
					}
				},
				medicine: {
					modifier: 0,
					proficiency: {
						expertise: false,
						proficient: false
					}
				},
				perception: {
					modifier: 0,
					proficiency: {
						expertise: false,
						proficient: false
					}
				},
				survival: {
					modifier: 0,
					proficiency: {
						expertise: false,
						proficient: false
					}
				}
			}
		},
		charisma: {
			score: 0,
			modifier: 0,
			skills: {
				deception: {
					modifier: 0,
					proficiency: {
						expertise: false,
						proficient: false
					}
				},
				intimidation: {
					modifier: 0,
					proficiency: {
						expertise: false,
						proficient: false
					}
				},
				performance: {
					modifier: 0,
					proficiency: {
						expertise: false,
						proficient: false
					}
				},
				persuasion: {
					modifier: 0,
					proficiency: {
						expertise: false,
						proficient: false
					}
				}
			}
		}
	}
};

character.proficiencyBonus = document.querySelector('#input__proficiency-bonus').getAttribute('value');


function onDocumentReady(fn) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}
function runDocumentReadyTasks() {
	forEachStatGetDetails(updateCharacterStatsVariable);
	forEachStatGetDetails(injectStatModifiers);
	forEachStatGetDetails(updateSkillModifiers);
	console.log(character.stats.charisma.skills);
}
function camelizeString(string) {
	return string.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
		return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
	}).replace(/\s+/g, '');
}
function forEachStatGetDetails(fn) {
	var statBlock = document.querySelectorAll('.stat-block');
	for (occuranceOfStatBlock = 0; occuranceOfStatBlock < statBlock.length; occuranceOfStatBlock++) {
		var thisStatBlock = statBlock[occuranceOfStatBlock];
		var thisStatType = thisStatBlock.getAttribute('data-stat-type');
		var thisStatValue = Number(thisStatBlock.querySelector('.stat__value').getAttribute('value'));
		var thisStatModifier = calculateStatModifier(thisStatValue);
		fn(thisStatBlock, thisStatType, thisStatValue, thisStatModifier);
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
function updateCharacterStatsVariable(statBlockElement, statType, statScore, statModifier) {
	console.log(eval('character.stats.' + statType + '.score = statScore'));
	console.log(eval('character.stats.' + statType + '.modifier = statModifier'));
	// return eval('character.stats.' + statType + '.score = statScore');
	return eval('character.stats.' + statType + '.modifier = statModifier');
}
function injectStatModifiers(statBlockElement, statType, statScore, statModifier) {
	var statBlockModifierInput = statBlockElement.querySelector('.stat__modifier');
	statBlockModifierInput.setAttribute('value', statModifier);
}
function updateSkillModifiers(statBlockElement, statType, statScore, statModifier) {
	var skillsOfStatType = document.querySelectorAll('.skill[data-stat-type="' + statType + '"]');
	for (occuranceOfskillsOfStatType = 0; occuranceOfskillsOfStatType < skillsOfStatType.length; occuranceOfskillsOfStatType++) {
		var skill = skillsOfStatType[occuranceOfskillsOfStatType];
		var skillName = camelizeString(skill.getAttribute('data-skill-name'));
		var skillType = skill.getAttribute('data-stat-type');
		var skillModifierInput = skill.querySelector('.skill__modifier');
		var skillExpertiseInput = skill.querySelector('.skill__expertise');
		var skillProficiencyInput = skill.querySelector('.skill__proficiency');
		checkForProficiencyBonuses(skillType, skillName, skillExpertiseInput, skillProficiencyInput);
	}
}
function checkForProficiencyBonuses(skillType, skillName, skillExpertiseInput, skillProficiencyInput) {
	var characterSkillVariable  = 'character.stats.' + skillType + '.skills.' + skillName;
	var characterSkillModifierVariable  = characterSkillVariable + '.modifier';
	var characterSkillProficiencyVariables  = characterSkillVariable + '.proficiency';
	if (skillExpertiseInput.checked) {
		updateProficiencyVariables(characterSkillProficiencyVariables, true, true);
		updateSkillModifierVariable(characterSkillProficiencyVariables, characterSkillModifierVariable);
	} else if (skillProficiencyInput.checked) {
		updateProficiencyVariables(characterSkillProficiencyVariables, false, true);
		updateSkillModifierVariable(characterSkillProficiencyVariables, characterSkillModifierVariable);
	} else {
		updateProficiencyVariables(characterSkillProficiencyVariables, false, false);
		updateSkillModifierVariable(characterSkillProficiencyVariables, characterSkillModifierVariable);
	}
}
function updateProficiencyVariables(characterSkillProficiencyVariables, expertise, proficient) {
	return eval(characterSkillProficiencyVariables + ' = {"expertise": ' + expertise + ', "proficient": ' + proficient + '}');
}
function updateSkillModifierVariable(characterSkillProficiencyVariables, characterSkillModifierVariable) {
	var proficiencyBonus = character.proficiencyBonus;
	var expertiseBonus = proficiencyBonus * 2;
	var characterSkillExpertise  = characterSkillProficiencyVariables + '.expertise';
	var characterSkillProficienct  = characterSkillProficiencyVariables + '.proficient';
	if (eval(characterSkillExpertise)) {
		return eval(characterSkillModifierVariable + ' = ' + (eval(characterSkillModifierVariable) + expertiseBonus));
	} else if (eval(characterSkillProficienct)) {
		return eval(characterSkillModifierVariable + ' = ' + (eval(characterSkillModifierVariable) + proficiencyBonus));
	}
}
function injectSkillsModifiers(statBlockElement, statType, statScore, statModifier) {
	var statBlockModifierInput = statBlockElement.querySelector('.stat__modifier');
	statBlockModifierInput.setAttribute('value', statModifier);
}

// function onStatChange(fn) {
// }
onDocumentReady(runDocumentReadyTasks);
