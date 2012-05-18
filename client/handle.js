// Generated by CoffeeScript 1.3.3
var ch_mode, chars, point, tag, waiting,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

tag = function(id) {
  return document.getElementById(id);
};

chars = 'qwertyuiasdfghjk';

point = void 0;

ch_mode = true;

waiting = false;

window.onload = function() {
  var back, down, enter, flip, goup, paper, render, search;
  window.socket = io.connect('http://localhost:8000/ime');
  socket.on('ready', function(data) {
    return console.log(data);
  });
  paper = tag('paper');
  window.article = {
    text: 'article:',
    elem: tag('article')
  };
  window.typing = {
    text: '',
    elem: tag('typing')
  };
  window.popup = {
    list: [],
    elem: tag('popup')
  };
  (render = function() {
    var html, index, insert, item, length, select, _i, _len, _ref;
    console.log(typing.text);
    article.elem.innerHTML = article.text.replace(/\n/g, '<br>') + '<span id="cursor"></span>';
    if (ch_mode) {
      window.cursor = tag('cursor');
      typing.elem.style.display = 'block';
      typing.elem.style.left = cursor.offsetLeft;
      typing.elem.style.top = cursor.offsetTop;
      typing.elem.innerText = typing.text;
      popup.elem.style.display = 'block';
      popup.elem.style.left = cursor.offsetLeft;
      popup.elem.style.top = cursor.offsetTop + 18;
      html = '';
      _ref = popup.list;
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        item = _ref[index];
        insert = index === point ? " id='select'" : '';
        html += "<p" + insert + ">" + item.word + "</p>";
      }
      popup.elem.innerHTML = html;
      if (select = tag('select')) {
        length = popup.elem.clientHeight + popup.elem.scrollTop;
        if (select.offsetTop + 36 > length) {
          popup.elem.scrollTop += 18;
        }
        if (select.offsetTop - 36 < popup.elem.scrollTop) {
          return popup.elem.scrollTop -= 18;
        }
      } else {
        return popup.elem.style.display = 'none';
      }
    } else {
      typing.elem.style.display = 'none';
      return popup.elem.style.display = 'none';
    }
  })();
  socket.on('search', function(list) {
    if (ch_mode) {
      popup.list = list;
      if (list.length > 0) {
        point = 0;
      }
      return render();
    }
  });
  search = function() {
    var left, list, piece, tail;
    point = void 0;
    list = [typing.text];
    piece = typing.text;
    while (piece.length > 3) {
      left = piece.length % 3;
      tail = left === 0 ? piece.length - 3 : piece.length - left;
      piece = typing.text.slice(0, tail);
      list.push(piece);
    }
    if (typing.text.length > 2) {
      socket.emit('search', list);
    }
    return render();
  };
  down = function() {
    if (ch_mode && popup.list.length > 0) {
      if (point < popup.list.length - 1) {
        point += 1;
      }
      return render();
    }
  };
  goup = function() {
    if (point != null) {
      if (ch_mode && popup.list.length > 0) {
        if (point > 0) {
          point -= 1;
        }
        return render();
      }
    }
  };
  back = function() {
    if (ch_mode && typing.text.length > 0) {
      typing.text = typing.text.slice(0, typing.text.length - 1);
      return search();
    } else {
      return render();
    }
  };
  enter = function() {
    if (ch_mode && typing.text.length > 0) {
      return console.log('enter');
    }
  };
  flip = function() {
    ch_mode = ch_mode ? false : true;
    return render();
  };
  document.onkeydown = function(e) {
    var char, code;
    code = e.keyCode;
    char = (String.fromCharCode(code)).toLowerCase();
    if (code === 38) {
      return goup();
    } else if (code === 40) {
      return down();
    } else if (code === 13) {
      return enter();
    } else if (code === 16) {
      return flip();
    } else if (code === 8) {
      return back();
    } else {
      return console.log(code);
    }
  };
  return document.onkeypress = function(e) {
    var char;
    char = String.fromCharCode(e.charCode);
    if (ch_mode) {
      if (__indexOf.call(chars, char) >= 0) {
        typing.text += char;
        return search();
      }
    } else {
      article.text += char;
      return render();
    }
  };
};
