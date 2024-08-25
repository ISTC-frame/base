let checkBonus = {};
let weightKey = {};
let bonusKey = {};
async function preloadRules() {
    try {
        const response = await fetch('rules.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        checkBonus = data.checkBonus || {};
        weightKey = (data.weightKey || []).reduce((acc, item) => {
            acc[item.name] = item.weight;
            return acc;
        }, {});
        bonusKey = (data.specialBonus || []).reduce((acc, item) => {
            acc[item.name] = item.point;
            return acc;
        }, {});
    } catch (error) {
        console.error('Error loading rules.json:', error);
    }
}
preloadRules();
var $ = {
    q: (e) => document.querySelector(e),
    qa: (e) => document.querySelectorAll(e),
    l: (e, s = document, ...h) => {
        s.addEventListener(e, (event) => {
            h.forEach(h => h(event));
        });
    },
    rl: (e, s = document, ...h) => {
        s.removeEventListener(e, (event) => {
            h.forEach(h => h(event));
        })
    },
    s: (el, attrs) => {
        for (let key in attrs) {
            if (attrs.hasOwnProperty(key)) {
                el.setAttribute(key, attrs[key]);
            }
        }
    },
    c: (e, i, p, ns, attrs) => {
        var el = ns ? document.createElementNS(ns, e) : document.createElement(e);
        if (i)
            el[(e === "img" || e === "video" || e === "audio") ? "src" : "innerHTML"] = i;
        if (p)
            p.append(el);
        if (e === "img")
            el.draggable = false;
        if (attrs)
            $.s(el, attrs);
        return el;
    }
};
(function() {
    const handleClick = (event) => {
        const target = event.target;
        if (target.classList.contains('check')) {
            target.classList.add('checked');
            increment(target, event);
        }
    };
    const handleContextMenu = (event) => {
        const target = event.target;
        const label = target.querySelector('.counter-label');

        if (!label || parseInt(label.textContent) === 1) {
            target.classList.remove('checked');
            console.log('remove');
        }
        decrement(target, event);
    };
    $.l('click', document, handleClick);
    $.l('contextmenu', document, handleContextMenu);
})();
function increment(el, e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    if (e && e.shiftKey) {
        const depthLabel = el.querySelector('.depth-label');
        if (depthLabel) {
            const maxDepth = depthLabel.getAttribute('data-max');
            const currentDepth = parseInt(depthLabel.textContent);
            if (!maxDepth || currentDepth < parseInt(maxDepth)) {
                depthLabel.textContent = currentDepth + 1;
            }
        }
    } else {
        const counterLabel = el.querySelector('.counter-label');
        if (counterLabel) {
            const maxCounter = counterLabel.getAttribute('data-max');
            const currentCounter = parseInt(counterLabel.textContent);
            if (!maxCounter || currentCounter < parseInt(maxCounter)) {
                counterLabel.textContent = currentCounter + 1;
            }
        }
    }
}
function decrement(el, e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    if (e && e.shiftKey) {
        const depthLabel = el.querySelector('.depth-label');
        if (depthLabel && parseInt(depthLabel.textContent) > 0) {
            depthLabel.textContent = parseInt(depthLabel.textContent) - 1;
        }
    } else {
        const counterLabel = el.querySelector('.counter-label');
        if (counterLabel && parseInt(counterLabel.textContent) > 0) {
            counterLabel.textContent = parseInt(counterLabel.textContent) - 1;
        }
    }
}
function selectAll(button) {
    const container = button.closest('.ban-weight');
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
    });
}
function deselectAll(button) {
    const container = button.closest('.ban-weight');
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = !checkbox.checked;
    });
}
function updateBG() {
    const levels = document.querySelectorAll('[class^="level"]');
    let highestCheckedLevel = 0;

    levels.forEach(level => {
        const checkedDivs = level.querySelectorAll('div.checked');
        const levelClass = level.className.match(/\d+/);

        if (levelClass && checkedDivs.length > 0) {
            const levelNumber = parseInt(levelClass[0], 10);
            if (levelNumber > highestCheckedLevel) {
                highestCheckedLevel = levelNumber;
            }
        }
    });

    if (highestCheckedLevel > 0) {
        const editor = document.getElementById('bg');
        editor.style.backgroundImage = `url('assets/HD/bg_zone_${highestCheckedLevel}.png')`;
    }
}
function inHole() {
    const limitedCheck = $.q('.limited-check');
    if (limitedCheck) {
        $.c('div', `
            <span class="counter-label">0</span>
            <span class="depth-label">0</span>
        `, limitedCheck, null, {
            class: 'counter-box beyond',
            onclick: 'increment(this, event)',
            oncontextmenu: 'decrement(this, event); return false;'
        });
    }
}
function outHole() {
    const limitedCheck = $.q('.limited-check');
    if (limitedCheck) {
        const counterBox = limitedCheck.querySelector('.counter-box.beyond');
        if (counterBox) {
            limitedCheck.removeChild(counterBox);
        }
    }
}
function getCheck() {
    const checkedNodes = document.querySelectorAll('div.checked');
    const checkInfo = Array.from(checkedNodes).map(node => {
        const counterLabel = node.querySelector('.counter-label');
        const counterValue = counterLabel ? parseInt(counterLabel.textContent, 10) : 1;
        const checkboxStates = Array.from(node.querySelectorAll('input[type="checkbox"]')).map(checkbox => ({
            id: checkbox.id,
            value: checkbox.value,
            checked: checkbox.checked
        }));
        const checknameSpan = node.querySelector('span.checkname');
        const checkname = checknameSpan ? checknameSpan.textContent.trim() : 'defaultCheckname';
        return { counterValue, checkboxStates, checkname };
    });
    function calcChBonus(checkInfo) {
        return function() {
            return checkInfo.reduce((totalBonus, item) => {
                const bonusItem = checkBonus.find(b => b.name === item.checkname);
                if (!bonusItem) return totalBonus;
                let itemBonus = bonusItem.baseScore;
                let noLeakBonus = 0;
                item.checkboxStates.forEach(checkbox => {
                    if (checkbox.checked) {
                        if (checkbox.id === 'era') {
                            const maxConditionValue = Math.max(...checkbox.value.split('/').map(value => bonusItem.conditions[value] || 0));
                            itemBonus += maxConditionValue;
                        } else if (['chaos', 'no-leak', 'emergency'].includes(checkbox.id)) {
                            const conditionBonus = bonusItem.conditions[checkbox.value] || 0;
                            itemBonus += conditionBonus;
                            if (checkbox.id === 'no-leak') {
                                noLeakBonus = conditionBonus;
                            }
                        }
                    }
                });
                if (item.checkname === '鸭速公路') {
                    totalBonus += itemBonus * item.counterValue;
                    if (noLeakBonus > 0) {
                        totalBonus -= noLeakBonus * (item.counterValue - 1);
                    }
                } else {
                    totalBonus += itemBonus;
                }
                return totalBonus;
            }, 0);
        };
    }
    const calculateBonus = calcChBonus(checkInfo);
    return calculateBonus();
}
function getOperation() {
    const operationDiv = document.querySelector('div.operation');
    const inputs = operationDiv.querySelectorAll('input');
    const operationInfo = Array.from(inputs).slice(0, 3).map(input => ({
        value: parseFloat(input.value)
    }));

    const calcOpBonus = (function() {
        return function(operationInfo) {
            let bonus = 0;
            if (operationInfo[0].value > 60) {
                bonus -= (operationInfo[0].value - 60) * 50;
            }
            bonus += operationInfo[1].value * -15;
            bonus += operationInfo[2].value * -6;
            return bonus;
        };
    })();

    return calcOpBonus(operationInfo);
}
function getSpecial() {
    const fortuneElement = document.querySelector('.fortune');
    const counterBoxes = fortuneElement.querySelectorAll('.counter-box');
    const specialInfo = [];

    counterBoxes.forEach(counterBox => {
        const secondClass = counterBox.classList[1];
        const counterLabel = parseInt(counterBox.querySelector('span.counter-label').textContent, 10);
        const depthLabel = parseInt(counterBox.querySelector('span.depth-label')?.textContent || 0, 10);
        specialInfo.push({ class: secondClass, value: counterLabel, depth: depthLabel });
    });

    const calcSpBonus = (function() {
        return function(specialInfo) {
            return specialInfo.reduce((total, item) => {
                if (item.class === 'beyond') {
                    return total + (item.value * bonusKey[item.class] * item.depth);
                }
                return total + (bonusKey[item.class] * item.value);
            }, 0);
        };
    })();

    return calcSpBonus(specialInfo);
}
function getWeight() {
    let totalWeight = 1;
    let ewStatus = 0;
    let checkedStatus = document.querySelector('.bossfight').querySelectorAll('div.checked').length > 0;
    const allSelections = Array.from(document.querySelectorAll('.ban-weight input[type="checkbox"], .ban-weight select, .ban-weight input[type="radio"]'))
        .map(element => ({
            id: element.id,
            checked: element.checked,
            value: element.value,
            type: element.type
        }));

    allSelections.forEach(selection => {
        if (selection.type === 'radio' && selection.checked) {
            ewStatus = (selection.id === 'option-yes') ? -1 : (selection.id === 'option-yee') ? 1 : ewStatus;
        } else if (selection.type === 'checkbox' && selection.id !== 'doctor-silver' && selection.checked) {
            totalWeight += weightKey[selection.id] || 0;
        } else if (selection.type === 'select-one' && selection.value !== 'none') {
            totalWeight += weightKey[selection.value] || 0;
        }
    });

    if (ewStatus === -1) {
        totalWeight *= 0.8;
    } else if (ewStatus === 1) {
        totalWeight += weightKey[Object.keys(weightKey).pop()];
    }
    if (!checkedStatus) {
        return ewStatus === -1 ? '0.8000' : '1.0000';
    }
    return Number(totalWeight).toFixed(4);
}
function calcBonus() {
    let originScore = parseFloat(document.getElementById('origin-score').value);
    let checkBonus = getCheck();
    let operationBonus = getOperation();
    let specialBonus = getSpecial();
    let weight = getWeight();

    let finalScore = (originScore + checkBonus + operationBonus + specialBonus) * weight;
    finalScore = parseFloat(finalScore.toFixed(4));
    let outputScore =`最终分数：[${originScore} + ${checkBonus} + (${operationBonus}) + ${specialBonus}) * ${weight}] = ${finalScore}`;
    //console.log(`最终分数：(${originScore} + ${checkBonus} + ${operationBonus} + ${specialBonus}) * ${weight} = ${finalScore}`);
    $.q('.final-score').textContent = outputScore;
}