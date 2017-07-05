![alt text](Angels,_Inc_Logo.png "Angels, Inc")
Angels, Inc Black Angels website
=================================
[Angels, Inc](https://www.angels-inc.com)

## Files
File | Purpose
---|---
index.html | Main page
index.css | CSS3 definition of main page
langs.css | CSS3 definition for language menu on the page
ft.jpg | First section cover image of the First Tuesday
Angels,_Inc_Logo.png | Company logo used in the header
Guy_Perryman.png | Guy Perryman profile picture as provided by Guy himself along with his bio
bap.jpg | YouTube first snapshot image of the video. Actually the link to YouTube generated image is used instead: <http://img.youtube.com/vi/iGtVq8konNk/0.jpg>
jquery.hoverIntent.js | jQuery plugin to improve from the $.hover() function by attempting to guess the user's intent and has some useful parameters to make the language menu work nicely.
magnific-popup | The magnific popup directory from Dmitry Semenov <http://dimsemenov.com/plugins/magnific-popup/>
jquery.magnific-popup.min.js | The JavaScript of Magnific popup
magnific-popup.css | The CSS for Magnific popup


## JavaScript
There is limited use of JavaScript in this document. I have made heavy use of pure CSS3 features. jQuery is used to provide some additional features proportionally to what is needed to provide the user an easy-to-use and convenient interface. No gadget here.

### On load
This is used to display a loading page visual instead of having nothing going on. It usually displays for a couple seconds.
``` JavaScript
$(window).on('load', function()
{
	$('#preloader').addClass('initLog').delay(1900).queue(function()
	{
		$(this).removeClass('initLog').addClass('initLogExit');
		$('body > header, body > label, body > nav, body > main, body > footer').css({'display':'block'});
		$(this).dequeue();
	});
});
```

### On document ready
This is used to enable the JavaScript code once the document is fully loaded.

This sets the available languages and is used by the propagateLang() function to check whether a language requested is actually implemented.
``` JavaScript
window.l10n = {
'en-GB'	: {
  'Undefined' : 'Undefined'
  },
'fr-FR'	: {
  'Undefined' : 'Indéfini'
  },
'ja-JP' : {
  'Undefined' : '未定義値'
  }
};
```

This is used to set the menu item as selected if the page was opened with an anchor in it, ie with a target to a section of the page
``` JavaScript
if( window.location.hash.length )
{
  var hash = window.location.hash;
  $( 'nav a' ).each(function(i,e)
  {
    if( hash == e.hash )
    {
      $(this).addClass( 'active' );
    }
    else
    {
      $(this).removeClass( 'active' );
    }
  });
}
```

Then we have this piece of jQuery code to catch any click on the menu items and set the .active class accordingly so the menu item can be displayed as being selected.
I wanted to use the :target selector, but I would have had to make considerable change to the structure of the code just to avoid a small piece of JavaScript, so it was clearly not worth the effort.
``` JavaScript
$('nav a').on('click', function()
{
  //var hash = window.location.hash;
  var hash = $(this).hash;
  $( 'nav a' ).each(function(i,e)
  {
          // checks if its the same on the address bar
    if( hash != e.hash )
    {
      $(this).removeClass( 'active' );
    }
  });
  $(this).addClass( 'active' );
});
```

Next is the localisation propagation based on the interface language active. This makes uses of the standard css :lang selector.
``` JavaScript
propagateThisSiteLang();
window.propagateLang = function( selectedLang )
{
  var langLower = new String( selectedLang ).toLowerCase();
  $(':root').attr( 'lang', selectedLang );
  $('title').text( $('title').data( langLower ) );
  $('input,textarea,select').each(function()
  {
    var eType = $(this).type || this.tagName.toLowerCase();
    var eName = $(this).attr('name');
    thisLang = new String( $(this).attr('lang') );
    if( typeof( thisLang ) != typeof( undefined ) &&
      thisLang !== false &&
      thisLang != 'undefined' &&
      thisLang.length > 0 )
    {
      if( $(this).attr('lang') == selectedLang )
      {
        $(this).attr( 'disabled', false );
      }
      else
      {
        $(this).attr( 'disabled', 'disabled' );
      }
    }
  });
};

function propagateThisSiteLang()
{
  if( typeof( propagateLang ) !== 'undefined' && $.isFunction( propagateLang ) )
  {
    propagateLang( $(':root').attr('lang') );
  }
  else
  {
    setTimeout( propagateThisSiteLang, 1000 );
  }
}

if( typeof( l10n[ $(':root').attr( 'lang' ) ] ) != 'undefined' )
{
  propagateLang( $(':root').attr( 'lang' ) );
}
```

I spent quite some time to find this information, because the documentation of magnificPopup is not very complete. So after hours of search, I found this pen at <https://codepen.io/meladq/pen/CLqtk>
``` JavaScript
$('.playVideo').magnificPopup(
{
  items:
  {
    src: 'https://www.youtube.com/watch?v=' + $('.playVideo').data('video-id')
  },
  type: 'iframe',
  iframe:
  {
      markup: '<div class="mfp-iframe-scaler">'+
              '<div class="mfp-close"></div>'+
              '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>'+
              '</div>',
    patterns:
    {
      youtube:
      {
        index: 'youtube.com/',
        id: 'v=',
        src: 'https://www.youtube.com/embed/%id%?autoplay=1&rel=0'
          }
    },
    srcAction: 'iframe_src',
  }
});
```

This is used to monitor any escape key press to discard the "about Guy" popup layer.
Since we use CSS3 to display the window, the anchor is the same as the div id. In our case #maestro. When setting the current address at something else, in CSS, this closes the window without using any JavaScript ! :-)
``` JavaScript
$(document).keyup(function(e)
{
  var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
  if( key == 27 )
  {
    document.location='#bap';
  }
});
```

If a click is made outside of the "about Guy" popup layer, then it gets closed.
``` JavaScript
$(document).on('click', function(e)
{
  var container  = $('#maestro');
  if( container.is( ':visible' ) )
  {
    // if the target of the click isn't the container...
    if( !container.is( e.target )
      // ... nor a descendant of the container
      && container.has( e.target ).length === 0 )
    {
      container.hide();
    }
  }
});
```

We set a hook to monitor any mouse over the language menu to display it. No need to click on it to reveal it as it would be an extra step and people would not necessarily know they had to click on it.
We use this jQuery plugin to provide richer control attribute. The initial pure CSS3 implementation did not work, because of the small space gap between the flag showing up when closed and the language menu list block. When moving from one to another, it loses focus and the list would get closed inadvertedly. Using hoverIntent() plugin solved that problem.
``` JavaScript
$('#langMenu').hoverIntent(
{
  over : function()
  {
    if( $('input[name=toggle]:checked').length > 0 )
    {
      return false;
    }
    $(this).attr( 'open', true );
  },
  out : function()
  {
    $(this).removeAttr( 'open' );
  },
  timeout : 500
});
```

Capture a language selection and propagate it using the propagateLang() function.
``` JavaScript
$('input[name=lang]').on( 'change', function(e)
{
  if( typeof( l10n[ $(this).val() ] ) == 'undefined' )
  {
    return false;
  }
  propagateLang( $(this).val() );
});
```

## Localisation (L10N)
### Formatting and structure
The Localisation follows the CSS3 standards, ie to localise from the loading the document into either British English, French or Japanese, set the html tag to the iso639 code such as:
``` html
<html lang="en-GB">
```
The JavaScript function propagateThisSiteLang() will call the function propagateLang() after the page is loaded to ensure the right localised text is displayed.

The localised text is set as tags with the lang selector set, such as in the page navigation menu:
``` html
<a href="#intro"><span lang="fr-FR">Home</span><span lang="en-GB">Home</span><span lang="ja-JP">ホーム</span></a>
```
Here the localised text is in a span tag, but if we wanted to localise a select menu, we could simply create different version of the select menu with he right language selector, such as:
``` html
<select lang="en-GB">...</select>
<select lang="ja-JP">...</select>
```
In the title tag, we use another slightly non-standard way to disply localised title without putting any span tag in it, which obviously would not work. The following is recognised by the propagateLang() function. Note that the language is all lower cap.
``` html
<title
  data-fr-fr="Angels, Inc Black Angels"
  data-en-gb="Angels, Inc Black Angels"
  data-ja-jp="エンジェルズインクのブラックエンジェルズ"
>Angels, Inc Black Angels</title>
```

The language code naming standards must be language-Country Code and in the case of UK, the country code is GB, not UK. There is no such thing as en-UK. See here the [ISO standard](https://www.iso.org/iso-3166-country-codes.html) for more information.

The CSS file [langs.css](./langs.css) contains all the specifications including the base 64 encoded country flags so there is no need to keep in mind to also copy whatever country flags are necessary. However, since there are over 250 countries, I only added the country flags of Asian countries.

### User interface
The language change selector is located at the top right, which is the expected location according to [this user study](http://flagsarenotlanguages.com/blog/2013/10/case-study-onefinestay-com-and-dropdown-language-selection/).
Once the language is set, it is remembered as a session information stored in the client-side.

## To do
1. Build the icons referenced in the header
1. Create a robots.txt file
1. Remove the unused language from the menu as they are here just to test
1. ~~Change the CSS in [index.css](./index.css) so a selected menu item is shown as selected~~ (fix #6)
1. Set overflow to default for the mobile version so the menu can be scrolled

See <https://github.com/angels-Inc/black-static/issues> for more
