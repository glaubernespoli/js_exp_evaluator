function evaluate(expression) {
    return Function('"use strict";return (' + expression + ')')();
}

let exp = 'true && (false || (true && true) && false || (true && false) && true) && true || (true && false)';

/**
 * 0: (true && true)
 * 1: (true && false)
 * 2: (false || (true && true) && false || (true && false))
 * 3: (true && false)
 * 4: true && (false || (true && true) && false || (true && false) && true) && true || (true && false) == 74
 */
try {
    const result = evaluate(exp);

    const expressions = extract(exp);
    // console.table(extract(exp));
} catch (e) {
    //TODO make a better error msg
    console.log(`Error: ${e}`);
}

// function capture(exp, expressions) {
//     const eval = XRegExp.matchRecursive(exp, '\\(', '\\)', 'gi', {
//         valueNames: [null, null, 'match', null]
//     });
//     console.log(eval);
//     if (eval.length > 0) {
//         eval.forEach(r => capture(r, expressions));
//     }
//     expressions.push(exp);
// }

function extract(exp) {
    return correctPos(capture(exp, []));
}

function capture(exp, expressions) {
    const eval = XRegExp.matchRecursive(typeof exp == 'string' ? exp : exp.value, '\\(', '\\)', 'gi', {
        valueNames: ['between', null, 'match', null]
    });
    eval.forEach(r => {
        if (r.value.includes('(')) {
            capture(r, expressions);
        }
        expressions.push(r);
    });

    if (typeof exp == 'string') {
        expressions.push({
            name: 'match',
            value: exp,
            start: 0,
            end: exp.length
        });
    }

    return expressions;
}

function correctPos(expressions) {
    const corrected = [];
    expressions.forEach((val, idx, arr) => {
        //only captures 'match'
        if (val.name == 'match') {
            //on root by default
            let parent = val;
            //if the previous one is a 'between, it means you're inside a nested group
            if (arr[idx - 1].name == 'between') {
                //iterates through the next elements to find the parent
                for (let i = idx + 1; i < arr.length; i++) {
                    let z = arr[i];
                    //if it's a 'match' and the start value is smaller than the start of the current, then it's the parent.
                    if (z.name == 'match' && val.start > z.start) {
                        parent = z;
                        break;
                    }
                }
            }

            corrected.push({
                value: val.value,
                start: val.start + parent.start,
                end: val.start + parent.start + (val.end - val.start)
            });
        }
    });
    return corrected;
}