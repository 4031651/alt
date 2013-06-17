// vars
/*global alt, testTitle, a, list, sublist, elem, $I, _*/
// controls
/*global IF, LET, EACH*/
//tags
/*global doctype, html, head, body, title, script, hr, span, ul, li, br*/
//attrs
/*global src, type, _style*/
var _tmpl = alt(function () {
    (doctype, 'html5')
  , (html,
        (head,
            (title, testTitle)
          , (script,
              (src, "//ajax.googleapis.com/ajax/libs/jquery/2.0.2/jquery.min.js")
            , (type, "text/javascript"))
          , (script,
              (type, "text/javascript")
            , (src, "js/html.js"))
          , (script,
              (type, "text/javascript")
            , (src, "js/html.js"))
          , (script,
              (type, "text/javascript")
            , (src, "js/main.js")))
      , (body, (_style, "white-space: pre;")
          , (hr)
          , (span, a.b)
          , (LET, a, 20, (span, a))
          , (span, a.b)
          , (hr)
          , (IF, a.b == 5,
                ' a.b == 5', 'a.b != 5')
          , (br)
          , (IF, a == 6,
                ' a.b == 6', 'a.b != 6')
          , (hr)
          // loop
          , (ul, (EACH, list, elem,
                (li, elem + ' ' + $I)) // End of each
            )
          , (hr)
          // nested loop
          , (EACH, list, sublist,
              (LET, _, $I,
                  (ul, (EACH, sublist, elem,
                      (li, elem + ' ' + ($I + _ * sublist.length))
                      )) // End of 2-nd each
              ) // End of let
            ) // End of 1-st each
    ))
});
