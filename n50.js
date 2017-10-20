// Copyright 2017 The Sakura111 Developers.
// This Javascript File belongs to project N50.

//===========
//--nihongo--
//===========
var Nihongo = {};
Nihongo.Katakana = [ // Pian Jia Ming
];
Nihongo.Hiragana = [ // Ping Jia Ming
	'あ', 'い', 'う', 'え', 'お',
	'か', 'き', 'く', 'け', 'こ',
	'さ', 'し', 'す', 'せ', 'そ',
	'た', 'ち', 'つ', 'て', 'と',
	'な', 'に', 'ぬ', 'ね', 'の',
	'は', 'ひ', 'ふ', 'へ', 'ほ',
	'ま', 'み', 'む', 'め', 'も',
	'や',       'ゆ',       'よ',
	'ら', 'り', 'る', 'れ', 'ろ',
	'を',                   'を',

	'が', 'ぎ', 'ぐ', 'げ', 'ご',
	'ざ', 'じ', 'ず', 'ぜ', 'ぞ',
	'だ', 'ぢ', 'づ', 'で', 'ど',
	'ば', 'び', 'ぶ', 'べ', 'ぼ',

	'ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ',

	'きゃ', 'きゅ', 'きょ',
	'ぎゃ', 'ぎゅ', 'ぎょ',
	'しゃ', 'しゅ', 'しょ',
	'じゃ', 'じゅ', 'じょ',
	'ちゃ', 'ちゅ', 'ちょ',
	'ひゃ', 'ひゅ', 'ひょ',
	'びゃ', 'びょ', 'びょ',
	'ぴゃ', 'ぴゅ', 'ぴょ',
	'みゃ', 'みゅ', 'みょ',
	'りゃ', 'りゅ', 'りょ'
];
Nihongo.Pinyin = [
	'a' , 'i'  , 'u'  , 'e' , 'o',
	'ka', 'ki' , 'ku' , 'ke', 'ko',
	'sa', 'shi', 'su' , 'se', 'so',
	'ta', 'chi', 'tsu', 'te', 'to',
	'na', 'ni' , 'nu' , 'ne', 'no',
	'ha', 'hi' , 'fu' , 'he', 'ho',
	'ma', 'mi' , 'mu' , 'me', 'mo',
	'ya',        'yu' ,       'yo',
	'ra', 'ri' , 'ru' , 're', 'ro',
	'wa',                     'wo',
	//fuzzy
	'ga', 'gi', 'gu', 'ge', 'go',
	'za', 'ji', 'zu', 'ze', 'zo',
	'da', 'di', 'du', 'de', 'do',
	'ba', 'bi', 'bu', 'be', 'bo',
	//semi-fuzzy
	'pa', 'pi', 'pu', 'pe', 'po',

	'kya', 'kyu', 'kyo',
	'gya', 'gyu', 'gyo',
	'sha', 'shu', 'sho',
	'ja' , 'ju' , 'jo' ,
	'cha', 'chu', 'cho',
	'hya', 'hyu', 'hyo',
	'bya', 'byu', 'byo',
	'pya', 'pyu', 'pyo',
	'mya', 'myu', 'myo',
	'rya', 'ryu', 'ryo'
];
Nihongo.Pick = function () {
	return Math.floor(Math.random() * Nihongo.Pinyin.length);
}
Nihongo.Aiueo = function (c) {
	return (c === 'a' || c === 'i' || c === 'u' || c === 'e' || c === 'o')
}

//===========
//--eventer--
//===========
// proposal: change the name to `reactor`.
// This module provides binders for user's abstract behavior,
// such as `onMenuLoad`, `onPinyinTestLoad`, etc.

var Keyboard = {
	$keys: document.getElementsByClassName('vkey')
};
Keyboard.handler = undefined;
Keyboard.BindHandler = function (h) {
	console.log('Keyboard.BindHandler');
	Keyboard.handler = h;
	for (var i = 0; i < Keyboard.$keys.length; i++) {
		Keyboard.$keys[i].ontouchstart = function (e) {
			e.preventDefault();
			Keyboard.handler(this.title);
		}
		Keyboard.$keys[i].ontouchmove = function (e) {
			e.preventDefault();
		}
		Keyboard.$keys[i].ontouchend = function (e) {
			e.preventDefault();
			e = e || window.event;
			e = e.keyCode || e.which;
			Ui.Key_ResetStyle(String.fromCharCode(e))
		}
	}
	document.body.onkeydown = function (e) {
		e.preventDefault();
		e = e || window.event;
		e = e.keyCode || e.which;
		if (e >= 65 && e < 65+26) {
			e += (97-65);
		}
		if (e >= 97 && e < 97+26) {
			Keyboard.handler(String.fromCharCode(e));
		} else if (e === 8) { // backspace
			Keyboard.handler('_')
		} else if (e === 32) { // space
			Keyboard.handler('?');
		}
	}
	document.body.onkeyup = function (e) {
		e.preventDefault();
		e = e || window.event;
		e = e.keyCode || e.which;
		Ui.Key_ResetStyle(String.fromCharCode(e));
		Asker.Pinyin.ResetPinyin();
	}
}
//======
//--ui--
//======
// This module provides operations to user interface like animation.
// TODO: divide this module to serveral layers, because ui is consisted
// by layers.

var Ui = {
	$nihongo: document.getElementById("pinyin_tester_nihongo"),
	$pinyin: document.getElementById("pinyin_tester_pinyin"),
	$letter: (function(){
		var l = document.getElementsByClassName('vkey')
		var a = [];
		for (var i = 0; i < l.length-1; ++i) {
			a.push(l[i]);
		}
		return a;
	})(),
	$hintkey: document.getElementById("vkey_hinter"),
	$delkey: document.getElementsByClassName("vkey-del")[0]
};
Ui.ShowSymbol = function (str) {
	Ui.$nihongo.innerText = str;
}
Ui.ShowPinyin = function (str) {
	Ui.$pinyin.innerText = '';
	if (str.length === 0) {
		Ui.$pinyin.innerText = '_';
	} else {
		Ui.$pinyin.innerText = str;
	}
}
Ui.Key_getIdx = function (k) {
	for (var i = 0; i < Ui.$letter.length; i++) {
		if (k === Ui.$letter[i].title) {
			return i;
		}
	}
	return -1;
}
Ui.Key_Hint = function (str) {
	for (var i = 0; i < str.length; i++) {
		var keyidx = Ui.Key_getIdx(str[i]);
		if (keyidx !== -1) {
			Ui.$letter[keyidx].setAttribute('class', 'vkey vkey-highlight', 'shin-'+i);
		}
	}
}
Ui.Key_ResetStyle = function (k) {
	console.log("Ui.NoKeyboardHint")
	for (var i = 0; i < Ui.$letter.length; i++) {
		Ui.$letter[i].setAttribute('class', 'vkey');
	}
}
//=========
//--asker--
//=========
// proposal: change the name to `N50`;
// This module should contains the main logics with the application.

var Asker = {};
Asker.Pinyin = {
	Buffer: [],
	answer: ""
};
Asker.Pinyin.New = function () {
	var idx = Nihongo.Pick();
	Ui.ShowSymbol(Nihongo.Hiragana[idx])
	Asker.Pinyin.answer = Nihongo.Pinyin[idx];
};
Asker.Pinyin.New();

Asker.Pinyin.Check = function () {
	return (Asker.Pinyin.answer === Asker.Pinyin.Buffer.join(''));
}

// c : char, (c > 'a' and c < 'z') or c == '_' or c == '?'
Asker.Pinyin.Handler = function (c) {
	var buff = Asker.Pinyin.Buffer;
	if (c === '?') {
		Ui.ShowPinyin(Asker.Pinyin.answer, 'green');
		Ui.Key_Hint(Asker.Pinyin.answer);
		return;
	}
	if (c !== '_') {
		if (Nihongo.Aiueo(buff[buff.length-1])) {
			Asker.Pinyin.Buffer = [];
		}
		if (buff.length >= 4) {
			Asker.Pinyin.Buffer = [];
		}
		Asker.Pinyin.Buffer.push(c);
		if (Nihongo.Aiueo(c) && Asker.Pinyin.Check()) {
			Asker.Pinyin.Buffer = [];
			Asker.Pinyin.New();
		}
	} else {
		Asker.Pinyin.Buffer.pop();
	}
	Ui.ShowPinyin(Asker.Pinyin.Buffer.join(''));
}

Asker.Pinyin.ResetPinyin = function () {
	Ui.ShowPinyin(Asker.Pinyin.Buffer.join(''));
}

//========
//--main--
//========
// This module load all the stuff.
Keyboard.BindHandler(Asker.Pinyin.Handler);
