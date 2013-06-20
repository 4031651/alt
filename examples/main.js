/*global _tmpl*/
$(function () {
    _tmpl.lineSep = "\n";
    $(document.body).text(_tmpl.render({
        testTitle: 'TEST test',
        a: {
            b: 5
        },
        list: [
            ['a', 'b', 'c'],
            ['d', 'e', 'f'],
            ['g', 'h', 'i']
        ]
    }));
});
