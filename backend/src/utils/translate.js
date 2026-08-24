async function translateText(text, targetLang = 'en') {
  if (!text) return null;
  try {
    const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=' + targetLang + '&dt=t&q=' + encodeURIComponent(text);
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    
    let result = '';
    for(let i=0; i<data[0].length; i++) {
        if(data[0][i][0]) {
            result += data[0][i][0];
        }
    }
    return result;
  } catch (error) {
    console.error('Translation error:', error);
    return null;
  }
}

module.exports = { translateText };
