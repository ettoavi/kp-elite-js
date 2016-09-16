/*
* JavaScript Object Inspector
* By Muhammad Eko Avianto
* Revision Januari 2015 : Improved
*/
var long_lines = 0;
function inspect(theObject,optionSetting) {
	current = this;
    var _dims = [];
    var cur_row = -1;
    _dims[0] = [];
	var setting = {
          elementID : false,		
          nested : false,
		  long:false,
          numbered:false
		}
    
    if(typeof(optionSetting)=='object') for (var p in optionSetting) setting[p] = optionSetting[p]

    function dInfo(num, col, count) {
        this.p =  {row:-1,col:-1};
        this.num = num;
        this.count = count;
        this.col = col;
        this.rowspan = 1;
        this.data = '';
        this.prop = '';
        this.parent = false;
        this.subdata = [];
        return this;
    }

    function oresult(col) {
        this.count = 0;
        this.col = col;		
        this.str ='';
        this.inc = function () {this.count += 1}
        this.arr = [];
        return this;
    }

    try {
        function doInspect(obj, maxLevels, level, t_style, parent, parentInfo,decrement) {
            var type, msg, i,
                first = true,
                spc = '';
            //if (typeof obj != "object") return "Invalid object";
            if (typeof decrement == "undefined") decrement = 0;			
            if (typeof (parent) !== 'string') parent = '';
            if (typeof (level) == 'undefined') level = 0;
			var or = new oresult(level);
            if (long_lines &gt; 1500 || level &gt; 10) {
                $debugger.wait = false;
                 //alert(level);
                 return or;
            }
            if (typeof (t_style) == 'undefined' || t_style == '') t_style = 'style="width:100%;padding:0px;margin:0;border:1px solid #000;font-family: Verdana, Tahoma, Arial, sans-serif;font-size:12px"';
            if (typeof (maxLevels) == 'undefined') maxLevels = 10;
            if (maxLevels &lt; 1) return '&lt;font color="red"&gt;Error: Levels number must be &gt; 0&lt;/font&gt;';
            // We start with a non null object
            if (obj == null) return '&lt;font color="red"&gt;Error: Object &lt;b&gt;NULL&lt;/b&gt;&lt;/font&gt;';
            or.str += '&lt;table border="0" cellspacing="0" cellpadding="0" ' + t_style + '&gt;';
            var _count = 0;
            firstStart = true;
            var _odata;
            for (var _prop in obj) {
                try {
                    long_lines++;
                    $debugger.track(_prop+'  '+long_lines,level);
                    _count++;
                    cur_row++; or.inc();
                    r_style = (first ? '' : 'border-top:1px solid #000;') + 'border-right:1px solid #000;';
                    var c_out = '';
                    var type = typeof (obj[_prop]);
                    _dims[cur_row] = [];
                    if (typeof (parentInfo) == 'object') {
                        for (var ix = 0; ix &lt; level; ix++) {
                            if (parentInfo.num == cur_row &amp;&amp; parentInfo.col == ix) {
                                _dims[cur_row][ix] = parentInfo
                            }
                            else {
                                if (parentInfo.num != cur_row &amp;&amp; typeof (_dims[cur_row][ix]) !== 'object') _dims[cur_row][ix] = 'sub'
                            }
                        }
                    }
                   _dims[cur_row][level] = _odata = new dInfo(cur_row, level, _count);
                    or.arr.push(_odata);
                   _odata.prop = _prop;
                    if (typeof (parentInfo) == 'object') {
                        if (setting.long) _odata.data = parentInfo.data + ((_prop !== ':') &amp;&amp; (parentInfo.prop !== ':') ? '.' : '');
                    }
                    switch (type) {
                    case 'function':
                        var _fn = obj[_prop].toString();
                        var _c = '',
                            _a = _fn.indexOf("(");
                        var _b = _fn.indexOf(")");
                        _c = _fn.substr(_a + 1, _b - _a - 1);
                        _odata.data += '&lt;span style="font-weight:bold;color:#660066;"&gt;' + _prop + '&lt;/span&gt;' + ((obj[_prop] == null) ? (': &lt;b&gt;null&lt;/b&gt;') : '') + '&amp;nbsp;:&amp;nbsp;function&lt;span style="font-weight:bold;color:#000033;"&gt;(&lt;/span&gt;&lt;span style="font-style:italic"&gt;' + _c + '&lt;/span&gt;&lt;span style="font-weight:bold;color:#000033;"&gt;)&lt;/span&gt;';
                        c_out += _odata.data;
                        break;
                    case 'string':
                        _odata.data += '&lt;span style="font-weight:bold;color:#000033;"&gt;' + _prop + '&lt;/span&gt;' + ((obj[_prop] == null) ? (': &lt;b&gt;null&lt;/b&gt;') : '') + '&amp;nbsp;:&amp;nbsp;"' + obj[_prop] + '"';
                        c_out += _odata.data;
                        break;
                    case 'number':
                        _odata.data += '&lt;span style="font-weight:bold;color:#993300;"&gt;' + _prop + '&lt;/span&gt;' + ((obj[_prop] == null) ? (': &lt;b&gt;null&lt;/b&gt;') : '') + '&amp;nbsp;:&amp;nbsp;' + obj[_prop];
                        c_out += _odata.data;
                        break;
                    case 'boolean':
                        _odata.data += '&lt;span style="font-weight:bold;color:#666600;"&gt;' + _prop + '&lt;/span&gt;' + ((obj[_prop] == null) ? (': &lt;b&gt;null&lt;/b&gt;') : '') + '&amp;nbsp;:&amp;nbsp;' + obj[_prop];
                        c_out += _odata.data;
                        break;
                    case 'object':
                        var css = '',
                            xp;
                        _odata.data += xp = _prop;
                        if (level + 1 &lt; maxLevels) {
                            var oret = doInspect(obj[_prop], maxLevels, level + 1, css, '', _odata);
                           _odata.subdata = oret.arr;
                            if (oret.str != '') {
                                var csstd = level &lt; 1 ? 'border-top:1px solid #000;border-bottom:1px solid #000;' : '';
                                c_out += _odata.data + ' ' + oret.str;
                            }
                            else {
                                c_out += _odata.data + ':{}';
                            }
                        }
                        break;
                    default:
                       _odata.data = 'unamed';
                        c_out += _odata.data;
                    }
                    spc += c_out;
                    r_style = level &gt; 1 ? 'border-right:1px solid #000;border-top:1px solid #000;border-bottom:0px solid #000;' : r_style;
                    c_tag = '&lt;tr&gt;&lt;td style="padding:4px;text-align:left;' + r_style + 'margin:0;width:100%;"&gt;';
                    or.str += c_tag + (setting.numbered?'&lt;font color="grey"&gt;' + level + '&lt;/font&gt;.&lt;font color="red"&gt;' + _count + '&lt;/font&gt;&lt;font color="grey"&gt;.&lt;/font&gt; ':'') + parent + c_out + '&lt;/td&gt;&lt;/tr&gt;';
                }
                catch (err) {
                    // Is there some properties in obj we can't access? Print it red.
                    if (typeof (err) == 'string') msg = err;
                    else if (err.message) msg = err.message;
                    else if (err.description) msg = err.description;
                    else msg = 'Unknown';
                    or.str += '&lt;tr&gt;&lt;td style="padding:4px;text-align:left;"&gt;' + cur_row + '.' + level + ' &lt;font color="red"&gt;(Error) ' + _prop + ': ' + msg + '&lt;/font&gt;&lt;/td&gt;&lt;/tr&gt;';
                }
                first = false;
            }
            or.str += '&lt;/table&gt;';
            if (spc == '') or.str = '';
            return or;
        }

        this.viewVert = function () {
            if (setting.element!==false) {
				var Id = document.getElementById(setting.elementID);
				Id.innerHTML = putNested();
            } else {
                createElement(this.viewVert);
            }
        }
		
        this.createElement = function(callfunc) {
            if (!document.getElementById('inspectorElement')){
               setting.element = 'inspectorElement';                
               var div = document["createElement"]("div")
               div["setAttribute"]("id", setting.element);
               document["getElementsByTagName"]("body")[0]["appendChild"](div)
               callfunc();
            }
        }
        this.viewHorz = function () {
            if (setting.element!==false) {
				var Id = document.getElementById(setting.elementID);
				Id.innerHTML = makeReadable(strtmp);
            } else {
                createElement(this.viewHorz);
            }
        }

         function checkElement(horz) {
            var result ='&lt;/br&gt;&lt;span style="font-size:8px"&gt;&lt;a style="text-decoration:none;color:red" href="#" onclick="current.'+(horz?'viewHorz()':'viewVert()')+'"&gt;Change View&lt;a&gt;&lt;/span&gt;';
            return (setting.elementID!==false?result:'');
		 }

         var readableStr = '';
         function makeReadable() {
            if (readableStr!=='') return readableStr;
            var n, m, ls, long = 0;
            var aro = [];
            m = '';
            row = 0;
            lastRow = 0;
            aro[0] = [];
            row_idx = 0;

            function findRootFromArray(p, add) {
                if (typeof (p) == 'object') {
                    p.rowspan += add;
                    try {
                        var o = aro[p.p.row][p.p.col];
                        findRootFromArray(o, add)
                    }
                    catch (e) {}
                }
                return p;
            }

            function pushRow(arr, col, p, level) {
                if (typeof (level) == 'undefined') level = 1;
                if (typeof (col) == 'undefined') col = 0;
                var col_idx, ic, result = 1;
                $.each(arr, function (i, v) {
                    v.rowspan = 1;
                    if (lastRow != row_idx) aro[row_idx] = [];
                    if (i &gt; 0) findRootFromArray(p, 1);
                    lastRow = row_idx;
                    col_idx = col + v.col;
                    aro[row_idx][col_idx] = v;
                    if (typeof (p) == 'object') {
                        v.p.row = p.num;
                        v.p.col = p.col;
                    }
                    //for(ic= 0;ic &lt; col_idx ;ic++ ) if ( aro[row_idx][ic] == null) aro[row_idx][ic] = dInfo();
                    v.num = row_idx;
                    row_idx++;
                    if(typeof(v.subdata)=='undefined') v.subdata=[];
                    ls = v.subdata.length;
                    if (ls &gt; 0) {
                        row_idx -= 1;
                        result--;
                    }
                    if (level + col &gt; long) long = level + col;
                    pushRow(v.subdata, col, v, level + 1);
                    //v.data = row_idx+'.'+v.rowspan +'.'+ (i+1) +'. '+ v.data;
                    v.data = '&amp;nbsp;' + (setting.numbered ? '&lt;font color="grey"&gt;' + (i + 1) + '.&lt;/font&gt; ' : '') + v.data;
                });
            }
            long = 0;
			
            pushRow(strtmp.arr, 0);
            $.each(aro, function (i, v) {
                for (m = aro[i].length; m &lt; long; m++) {
                    if (aro[i].length &lt; long) aro[i][m] = new dInfo();
                }
            });
            readableStr = '';
            $.each(aro, function (i, v) {
                readableStr += '&lt;tr&gt;';
                for (var n = 0; n &lt; long; n++) {
                    if (typeof (v[n]) == 'object') {
                        //readableStr += '&lt;td' + (v[n].rowspan &gt; 1 ? ' rowspan="' + (v[n].rowspan - 0) + '"' : '') + ' style="border:1px solid #000;"&gt;' + v[n].data + '&lt;/td&gt;';
                        readableStr += '&lt;td' + (v[n].rowspan &gt; 1 ? ' rowspan="' + (v[n].rowspan - 0) + '"' : '') + ' style="border-top:1px solid #000;' + (n !== 0 ? 'border-left:1px solid #000;' : '') + '"&gt;' + v[n].data + '&lt;/td&gt;\n';
                    }
                }
                readableStr += '&lt;/tr&gt;\n';
            });
            var th = '&lt;thead&gt;\n&lt;tr&gt;&lt;th colspan="' + long + '" style="border-bottom:1px solid #000;padding: 10px;font-family: Verdana, Tahoma, Arial, sans-serif;"&gt;&lt;span style="font-size:14px;font-weight:bold;"&gt;Object Inspector&lt;/span&gt;'+checkElement(false)+'&lt;/th&gt;&lt;/tr&gt;\n&lt;/thead&gt;\n';
            th += '&lt;tfoot&gt;\n&lt;tr&gt;&lt;th colspan="' + long + '" style="border-top:2px solid #000;padding: 10px;font-family: Verdana, Tahoma, Arial, sans-serif;"&gt;&lt;span style="font-size:11px;font-weight:bold;"&gt;Object Done&lt;/span&gt;&lt;/br&gt;&lt;span style="font-size:8px"&gt;By :&lt;a style="text-decoration:none;color:#000" href="https://plus.google.com/+MuhammadEkoAvianto/posts"&gt;Muhammad Eko Avianto&lt;a&gt;&lt;/span&gt;&lt;/th&gt;&lt;/tr&gt;\n&lt;/tfoot&gt;\n';
            readableStr = '&lt;table border="0" cellspacing="0" cellpadding="0" style="padding:0px;margin:0;border:1px solid #000;font-family: Verdana, Tahoma, Arial, sans-serif;font-size:12px"&gt;\n' + th + '&lt;tbody&gt;\n' + readableStr + '&lt;/tbody&gt;\n' + '&lt;/table&gt;\n';
            return readableStr;
        }
		
        function putNested() {
            var sc = '&lt;span style="font-size:14px;font-weight:bold;"&gt;Object Inspector&lt;/span&gt;'+checkElement(true)+'\n';
			return '&lt;div&gt;&lt;div style="border:1px solid #000;padding: 5px;font-family: Verdana, Tahoma, Arial, sans-serif;text-align:center;"&gt;'+sc+'&lt;/div&gt;\n&lt;div style="clear:both;"&gt;'+strtmp.str+'&lt;/div&gt;\n&lt;/div&gt;'
        }
		
        var strtmp = doInspect(theObject);		
        if (setting.elementID==false) {
            setting.elementID = 'inspector_tag_id';
            var p = document.getElementsByTagName("body");
            var dv = document.createElement("div");
            p[0].appendChild(dv);			
                dv.setAttribute('id', setting.elementID);
                dv.setAttribute('style','width:25%;');
		}
		
        if (setting.nested) {current.viewVert()} else {current.viewHorz()}
		return '';
        if (setting.nested) return putNested();
		return makeReadable();
		
    }
    catch(err) {
        alert(err);
		return 'error';
    }
}
