var alphaChoice = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()';
var removeChar = false;
var removeSpaces = false;
var blocks = false;
var obj = {};

function randomKey(keyLength) {
  b = alphaChoice;
  alph = alphaChoice;
  keyw = "";
  keyl = keyLength;
  for (j = 0; j < keyl; j++) {
    m = randomNumber(0, alph.length - 1);
    keyw = keyw + alph.substr(m, 1);
    alph = alph.substr(0, m) + alph.substr(m + 1, alph.length);
  }

  return keyw;
}

function keyNumbers(string) {
  a = 1;
  k = Array(string.length);
  for (i = 0; i < alphaChoice.length; i++) {
    for (j = 0; j < string.length; j++) {
      if (string.substr(j, 1) == alphaChoice.substr(i, 1)) {
        k[j] = a;
        a = a + 1;
      }
    }
  }
  return k;
}


function belongsTo(character, checkstring) {
  p = 0;
  for (k = 0; k < checkstring.length; k++) {
    if (character == checkstring.substr(k, character.length)) {
      p = p + 1;
    }
  }
  if (p > 0) {
    return "true";
  } else {
    return "false";
  }
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (1 + max - min) + min);
}

function maxValue(array) {
  tester = array;
  r = tester[0];
  for (i = 1; i < tester.length; i++) {
    r = Math.max(r, tester[i])
  }
  return r;
}

function permuteEncrypt(string, string2) {
  ptext = string;
  key = string2;
  nulls = false;



  m = Math.ceil(ptext.length / key.length);

  mainArray = Array(m);
  for (i = 0; i < m; i++) {
    mainArray[i] = Array(key.length);
    for (s = 0; s < key.length; s++) {
      mainArray[i][s] = "";
    }
  }

  q = 0;
  for (i = 0; i < m; i++) {
    for (j = 0; j < key.length; j++) {
      mainArray[i][j] = ptext.substr(q, 1);
      q = q + 1;
    }
  }

  keyn = keyNumbers(key);

  cArray = Array(m);
  for (i = 0; i < m; i++) {
    cArray[i] = Array(key.length);
    for (s = 0; s < key.length; s++) {
      cArray[i][s] = "";
    }
  }

  for (i = 0; i < m; i++) {
    for (j = 0; j < keyn.length; j++) {
      cArray[i][keyn[j] - 1] = mainArray[i][j];
    }
  }

  ctext = "";
  for (i = 0; i < m; i++) {
    ctext = ctext + cArray[i].join("");
  }

  return ctext;
}

function permuteDecrypt(string, string2) {
  ctext = string;
  key = string2;

  m = Math.ceil(ctext.length / key.length);
  count = ctext.length;
  while (count % key.length != 0) {
    count = count + 1;
  }
  count = count - ctext.length + 1;

  mainArray = Array(m);
  for (i = 0; i < m; i++) {
    mainArray[i] = Array(key.length);
    for (s = 0; s < key.length; s++) {
      mainArray[i][s] = "";
    }
  }

  keyn = keyNumbers(key);

  for (j = 1; j < count; j++) {
    mainArray[m - 1][parseInt(keyn[keyn.length - j]) - 1] = "blank";
  }

  q = 0;
  for (i = 0; i < m; i++) {
    for (j = 0; j < key.length; j++) {
      if (mainArray[i][j] == "") {
        mainArray[i][j] = ctext.substr(q, 1);
        q = q + 1;
      }
    }
  }


  pArray = Array(m);
  for (i = 0; i < m; i++) {
    pArray[i] = Array(key.length);
    for (s = 0; s < key.length; s++) {
      pArray[i][s] = "";
    }
  }

  for (i = 0; i < m; i++) {
    for (j = 0; j < keyn.length; j++) {
      for (k = 0; k < keyn.length; k++) {
        if (keyn[j] == k + 1) {
          pArray[i][j] = mainArray[i][k];
        }
      }
    }
  }

  for (j = 0; j < key.length + 1; j++) {
    if (pArray[m - 1][j] == "blank") {
      pArray[m - 1][j] = "";
    }
  }

  ptext = "";
  for (i = 0; i < m; i++) {
    ptext = ptext + pArray[i].join("");
  }

  return ptext;

}



function remove(stringUsed, alphabetUsed) {
  m = 0;
  newstring = stringUsed;
  while (m < newstring.length) {
    if (belongsTo(newstring.substr(m, 1), alphabetUsed) == "false") {
      newstring = newstring.substring(0, m) + newstring.substring(m + 1, newstring.length);
    } else {
      m++;
    }
  }
  return newstring;
}

function blocks(string) {
  newstring = string;
  strlength = newstring.length;
  d = 5;
  while (d < strlength) {
    newstring = newstring.substring(0, d) + " " + newstring.substring(d, strlength);
    strlength = newstring.length;
    d = d + 6;
  }
  return newstring;
}



exports.encrypt = function(plaintext,iterations) {
  if (alphaChoice == "" || !alphaChoice) {
    alert("Choose an alphabet, or type your own.");
  } else {
    alphabet1 = alphaChoice;
    alphabet2 = " " + alphabet1;
    plain = plaintext;
    key = randomKey(plaintext.length);
    keyword = key;

    if (removeChar == true) {
      plain = remove(plain, alphabet2);
      keyword = remove(keyword, alphabet2);
    }


    if (removeSpaces) {
      plain = remove(plain, alphabet1);
      keyword = remove(keyword, alphabet1);
    }

    cipher1 = plain;


    for (w = 0; w < iterations; w++) {
      cipher1 = permuteEncrypt(cipher1, keyword);
    }

    cipher = cipher1;


    if (blocks == true) {
      cipher = remove(cipher, alphabet1);
      cipher = blocks(cipher);
    }

    obj.cipher = cipher;
    obj.key = key;
    obj.iterations = iterations;

    return obj;

  }
}

exports.decrypt = function(ciphertext, key, iterations) {
  if (alphaChoice == "" || !alphaChoice) {
    alert("Choose an alphabet, or type your own.");
  } else if (key == "" || !key) {
    alert("Type a key to use for the encryption.");
  } else {
    alphabet1 = alphaChoice;
    alphabet2 = " " + alphabet1;
    cipher = ciphertext;

    keyword = key;

    if (removeChar == true) {
      cipher = remove(cipher, alphabet2);
      keyword = remove(keyword, alphabet2);
    }

    if (removeSpaces == true) {
      cipher = remove(cipher, alphabet1);
      keyword = remove(keyword, alphabet1);
    }

    cipher1 = cipher;

    for (w = 0; w < iterations; w++) {
      cipher1 = permuteDecrypt(cipher1, keyword);
    }

    plain = cipher1;

    if (blocks == true) {
      plain = remove(plain, alphabet1);
      plain = blocks(plain);
    }

    obj.data = plain;
    obj.key = key;
    obj.iterations = iterations;

    return obj;

  }
}
