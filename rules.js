var $ = {
    q: (e) => document.querySelector(e),
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
    const label = el.querySelector('.counter-label');
    if (label) {
        label.textContent = parseInt(label.textContent) + 1;
    }
}
function decrement(el, e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    const label = el.querySelector('.counter-label');
    if (label && parseInt(label.textContent) > 0) {
        label.textContent = parseInt(label.textContent) - 1;
    }
}
function getCheck() {
    const bonusKey = [
        {
            name: '溃乱魔典',
            baseScore: 30,
            conditions: {}
        },
        {
            name: '大棋一盘',
            baseScore: 20,
            conditions: {
                '苦难': 20
            }
        },
        {
            name: '猩红甬道',
            baseScore: 40,
            conditions: {
                '天灾': 20,
                '苦难': 20,
                '金融': 20
            }
        },
        {
            name: '假想对冲',
            baseScore: 30,
            conditions: {
                '奇观': 20,
                '魔王': 20
            }
        },
        {
            name: '朽败考察',
            baseScore: 20,
            conditions: {
                '金融': 20,
                '魔王': 20
            }
        },
        {
            name: '年代断层',
            baseScore: 0,
            conditions: {
                '魔王': 20,
                '天灾': 20,
                '金融': 20
            }
        },
        {
            name: '计划耕种',
            baseScore: 70,
            conditions: {
                '苦难': 20,
                '奇观': 20
            }
        },
        {
            name: '寄人城池下',
            baseScore: 50,
            conditions: {
                '金融': 20,
                '奇观': 20
            }
        },
        {
            name: '通道封锁',
            baseScore: 30,
            conditions: {
                '奇观': 20
            }
        },
        {
            name: '无罪净土',
            baseScore: 30,
            conditions: {
                '奇观': 20
            }
        },
        {
            name: '巫咒同盟',
            baseScore: 30,
            conditions: {
                '奇观': 20
            }
        },
        {
            name: '残损学院',
            baseScore: 20,
            conditions: {}
        },
        {
            name: '谋求共识',
            baseScore: 70,
            conditions: {
                '金融': 20,
                '奇观': 20
            }
        },
        {
            name: '神圣的渴求',
            baseScore: 40,
            conditions: {
                '奇观': 20,
                '天灾': 20
            }
        },
        {
            name: 'BOSS FIGHT',
            baseScore: 30,
            conditions: {
                '卫国前夜': 30
            }
        },
        {
            name: '紧急授课',
            baseScore: 0,
            conditions: {
                '混乱': 20,
                '无漏': 30
            }
        },
        {
            name: '朝谒',
            baseScore: 120,
            conditions: {
                '金融': 20,
                '奇观': 20,
                '拥挤': 20,
                '混乱': 30,
                '无漏': 50
            }
        },
        {
            name: '圣城',
            baseScore: 170,
            conditions: {
                '奇观': 50,
                '拥挤': 50,
                '魔王': 50,
                '混乱': 30,
                '无漏': 50
            }
        },
        {
            name: '信号灯',
            baseScore: 0,
            conditions: {
                '紧急': 25,
                '无漏': 25
            }
        },
        {
            name: '劫虚济实',
            baseScore: 0,
            conditions: {
                '紧急': 25,
                '无漏': 25
            }
        },
        {
            name: '战场侧面',
            baseScore: 20,
            conditions: {
                '紧急': 20
            }
        },
        {
            name: '鸭速公路',
            baseScore: 20,
            conditions: {
                '无漏': 40
            }
        },
        {
            name: '叙事邀约',
            baseScore: 0,
            conditions: {
                '无漏': 40
            }
        },
        {
            name: '狭路相逢',
            baseScore: 10,
        }
    ];
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
                const bonusItem = bonusKey.find(b => b.name === item.checkname);
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
    const bonusKey = {
        'duck': 10,
        'bear': 10,
        'dog': 10,
        'mouse': 10,
        'six-star': 50,
        'five-star': 20,
        'four-star': 10
    };
    const fortuneElement = document.querySelector('.fortune');
    const counterBoxes = fortuneElement.querySelectorAll('.counter-box');
    const specialInfo = [];

    counterBoxes.forEach(counterBox => {
        const secondClass = counterBox.classList[1];
        const counterLabel = counterBox.querySelector('span.counter-label').textContent;
        specialInfo.push({ class: secondClass, value: parseInt(counterLabel, 10) });
    });

    const calcSpBonus = (function() {
        return function(specialInfo) {
            return specialInfo.reduce((total, item) => {
                return total + (bonusKey[item.class] * item.value);
            }, 0);
        };
    })();

    return calcSpBonus(specialInfo);
}
function getWeight() {
    const weightKey = {
        "逻各斯": 0.05,
        "麒麟R夜刀": 0.05,
        "傀影": 0.05,
        "阿斯卡纶": 0.05,
        "纯烬艾雅法拉": 0.03,
        "塑心": 0.03,
        "凯尔希": 0.03,
        "伊内丝": 0.03,
        "乌尔比安": 0.03,
        "妮芙": 0.03,
        "维什戴尔": 0.0711
    };
    let totalWeight = 1;
    let ewStatus = 0;
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
    return Number(totalWeight).toFixed(4);
}
function calcBonus() {
    let originScore = parseFloat(document.getElementById('origin-score').value);
    let checkBonus = getCheck();
    let operationBonus = getOperation();
    let specialInfo = getSpecial();
    let weight = getWeight();

    let finalScore = (originScore + checkBonus + operationBonus + specialInfo) * weight;
    let outputScore =`最终分数：(${originScore} + ${checkBonus} + ${operationBonus} + ${specialInfo}) * ${weight} = ${finalScore}`;
    console.log(`最终分数：(${originScore} + ${checkBonus} + ${operationBonus} + ${specialInfo}) * ${weight} = ${finalScore}`);
    $.q('.final-score').textContent = outputScore;
}