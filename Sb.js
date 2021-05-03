console.log("D:[REQUIRE]:S.child process");
const childProcess = require('child_process');
console.log("D:[REQUIRE]:S.https");
const https = require('https');
console.log("D:[REQUIRE]:google translate");
const translate = require("@k3rn31p4nic/google-translate-api");
console.log("D:[REQUIRE]:python-shell");
const { PythonShell } = require('python-shell');
console.log("D:[REQUIRE]:fs-extra");
const fs = require("fs-extra");
console.log("D:[REQUIRE]:kuromoji.js");
const kuromoji = require("kuromoji");
console.log("D:[REQUIRE]:cheerio");
const client = require("cheerio-httpcli");
console.log("D:[REQUIRE]:discord.js");
const discord = require("discord.js");

console.log("D:[import ]:siritori.json");
var words = fs.readJSONSync("siritori.json");
console.log("D:[import ]:kuromoji.js");
var marcof_dict = fs.readJSONSync("word.json");

word = [];
var marcof_tmp = [];
var tokenize = undefined;


var wordlist_en = [
	"I",
	"You",
	"You",
	"crazy",
	"hi",
	"hello",
	"nice",
	"code",
	"great",
	"crazy",
	"fuck",
	"room",
	"tired",
	"human",
	"discord",
	"disable",
	"enable",
	"blue",
	"yellow",
	"white",
	"black",
	"purple",
	"red",
	"drive",
	"double",
	"slab",
	"wood",
	"stone",
	"create",
	"programing",
	"Are",
	"?",
	"single",
	"broken",
	"minecraft",
	"freeze",
	"bananajo",
	"Make",
	"To",
	"Hack",
	"TRC",
	"Shop",
	"Release",
	"friend",
	"Bananajo!",
	"fuck bananajo",
	"syoch"
];
var token;
const option = {
	cs_v: "4.0.30319",
	pythonPath: "./py/python.exe"
};
(async function () {
	console.log("D:[System ]:program start(node init done)");

	//discord
	console.log("I:[DISCORD]:syoch login...");
	var client_syoch = await discord_login(discord, require("fs").readFileSync("token").toString());
	//kuromoji

	console.log("D:[OBJECT ]:makeing kuromoji object");
	console.log("D:[OBJECT ]: using default dic");
	var builder = kuromoji.builder({
		"dicPath": "node_modules/kuromoji/dict"
	});
	tokenize = await kuromoji_build(builder);

	console.log("I:[DISCORD]:username=", client_syoch.user.username);
	token = RegExp(client_syoch.token, "ig");
	console.log(typeof tokenize)
	var analyze_token = (src) => { return analyze(tokenize, src) };
	await analyze_allc(analyze_token, client_syoch);
	console.log("I:[MARCOF ]:Createing Dictionary")
	marcof_dict = await generate_marcof_dict(tokenize, marcof_tmp);
	save_marcof_dict();
	client_syoch.on("message", async (msg) => {
		if (msg.content.match(/^Sb.!.*$/) == null) return;
		var noarg = false;
		_ = msg.content.match(/^([^!]*)!([^\s]*) (.*)$/);
		if (!_) {
			_ = msg.content.match(/^([^!]*)!([^\s]*)$/);
			noarg = true;
		}
		var type = _[1], cmd = _[2], arg_ = _[3];
		var args;
		if (noarg) {
			args = [];
		} else {
			args = arg_.split(" ")
		}

		console.log("I:[DISCORD]:" + `use ${msg.author.tag} ${msg.author.id} ${type} ${cmd} ${args}`)

		if (type == "Sbg") {
			if (cmd == "help") {
				msg.channel.send(
					"```" + "\n" +
					"カテゴリリスト\n" +
					" Sbg 総合\n" +
					" Sbs 検索\n" +
					" Sbu ツール\n" +
					" Sbo その他\n" +
					" Sbe プログラム実行\n" +
					" Sbo その他\n" +
					"Sbgのコマンドリスト\n" +
					" help ヘルプ\n" +
					"Sbsのコマンドリスト\n" +
					" google グーグル検索\n" +
					" yahoo ヤフー検索\n" +
					"Sbuのコマンドリスト\n" +
					" crazyeng 意味不明な英文を作成して、翻訳\n" +
					"Sbeのコマンドリスト\n" +
					" js javascriptのプログラムを実行\n" +
					" py pythonのプログラムを実行\n" +
					" cs C#のプログラムを実行\n" +
					"Sboのコマンドリスト\n" +
					" しりとり しりとりカンニング\n" +
					" spam スパム\n" +
					" marcof マルコフ連鎖を使用して文章を作成（精度は保証しない）\n" +
					"引数リスト\n" +
					" Sbg!help\n" +
					" Sbo!しりとり <target:str>\n" +
					" Sbo!spam channel <id:snowflake> <count:int> <send:string>\n" +
					" Sbo!spam user <id:snowflake> <count:int> <send:string>\n" +
					" Sbo!marcof <count:int>" +
					" Sbu!crazyeng <row:int> <col:int>\n" +
					" Sbe!js (function(){console.log('hi');return 0;})()\n" +
					" Sbe!py print('hi')\n" +
					" Sbr!cs System.Console.WriteLine('hi')\n" +
					" Sbu!crazyeng <line:int> <word:int>\n" +
					" Sbe!** <program:string>\n" +
					" Sbo!Embed <embed:json>\n" +
					" Sbu!translate <from_lang:str> <to_lang:str> <from:str>\n" +
					" Sbs!google <search:str>\n" +
					" Sbs!yahoo <search:str>\n" +
					"```"
				);
			}
		} else if (type == "Sbo") {
			if (cmd == "ai") {
				ai(msg, args);
				return;
			} else if (cmd == "marcof") {
				try {
					max = parseInt(args[0])
					msg.channel.send(generate_marcof_str(convert_marcof_dict(marcof_dict), max))

				} catch (error) {
					msg.channel.send("err:" + error)
				}
				return;
			} else if (cmd == "しりとり") {
				a = [];
				var a = words.filter((now_word) => { if (!!now_word) return now_word[0] == args.join(" ").slice(-1) });
				console.log(a);
				if (a != []) {
					msg.channel.send("考えられるのは\n" + `[${a.join("\n")}]`);
				} else {
					msg.channel.send("ワードが見つかりませんでした")
				}
			} else if (cmd == "spam") {
				if (args[0] == "channel") {
					for (i = 0; i <= args[1]; i++) {
						client_syoch.channels.get(args[2]).send(args[3])
					}
				} else if (args[0] == "user") {
					for (i = 0; i <= args[1]; i++) {
						client_syoch.users.get(args[2]).send(args[3])
					}
				}
			} else if (cmd == "Embed") {
				var embed_opt_ = args.join("")
				if (!embed_opt_.match(/{.*}/)) msg.channel.send("Invaild JSON string!");
				try {
					var embed_opt = JSON.parse(embed_opt_);

				} catch (error) {
					msg.channel.send("JSON parsing error", err.message)
				}
				msg.channel.send({ content: "Embed", embed: embed_opt })
			}
		} else if (type == "Sbu") {
			if (cmd == "crazyeng") {
				var a = await create_crazyenglish(args[0], args[1]);
				msg.channel.send(a);
			} else if (cmd == "translate") {
				var prog = await msg.channel.send("translate...")
				var lfrom = args[0];
				var lto = args[1];
				var opt = {};
				if (lfrom) opt.from = lfrom
				if (lto) opt.to = lto;
				try {
					var translated = await translate(args.slice(2).join(" "), opt)
				} catch (error) {
					prog.edit(
						"```js\n" +
						"Error Translate!\n" +
						`Message:${error.message}` +
						"```"
					)
					return;
				}
				prog.edit(
					"```js\n" +
					"Done Translate!\n" +
					`Setting:${lfrom}->${lto}\n` +
					`translated message ${translated.text}` +
					"```"
				)
			} else if (cmd == "ytdl") {
				var DLtype = args[0];
				var i = 0, filename = "";
				if (type == "video") {
					i = 0;
					filename = "yt.mp4"
				} else if (type == "audio") {
					i = 1;
					filename = "yt.mp3"
				}
				var DLlink = await getlink(args[1]);
				console.log(DLlink)
				if (DLlink[0] == "") {
					msg.channel.send("Error please send a correct video id")
					return;
				}
				var attachment = new discord.Attachment(DLlink[i])
				console.log(attachment)
				msg.channel.send("Success!\n" +
					`Videotype:${DLtype}\n` +
					`author:${msg.author.tag}\n`)
				msg.channel.send(attachment)
			}
		} else if (type == "Sbe") {
			var returnvalue = 0;
			var log = "";
			var except = "No except"
			if (cmd == "js") {
				var b;
				if (args.join(" ").match("fs")) {
					msg.channel.send("fs系は禁止されています")
				}
				function cl() { log += Array.apply(null, arguments).join(" ") + " " };
				cl.log = console.log;
				console.log = cl;
				try {
					returnvalue = eval(args.join(" "));
				} catch (error) {
					except = error;
				}
				console.log = cl.log;
			} else if (cmd == "py") {
				var d = [];
				if (args.join(" ").indexOf("input") != -1) {
					msg.channel.send("inputは禁止されています");
					return;
				}
				try {
					d = await evalpy(args.join(" "));

				} catch (error) {
					except = error;
				}
				if (!!d[1]) {
					except = d[1].Error.split("\n")[0];
				}
				log = d.slice(0, -1).join("\n");
				returnvalue = d.slice(-1);
			} else if (cmd == "cs") {
				if (args.join(" ").indexOf("Read") != -1) {
					msg.channel.send("Read系は禁止されています");
					return;
				}
				fs.writeFileSync("tmp.cs",
					`class Program
                            {
                                static void Main(string[] args)
                                {
                                    ${args.join(" ")};
                                }
                            }`);
				var compilelog = childProcess.execSync(`C:\\Windows\\Microsoft.NET\\Framework\\v4.0.30319\\csc.exe tmp.cs`).toString();
				if (fs.existsSync("tmp.exe")) {
					var runlog = childProcess.execSync("tmp.exe").toString();
					fs.removeSync("tmp.exe");
					msg.channel.send(
						"プログラム実行に成功しました\n" +
						"```\n" +
						compilelog + "\n" +
						"```\n" +
						"```\n" +
						runlog + "\n" +
						"```"
					)
				} else {
					msg.channel.send(
						"ぷろぐらむのコンパイルに失敗しました\n" +
						"```\n" +
						compilelog + "\n" +
						"```\n"
					)
				}
			} else {
				returnvalue = "-----";
				log = "-----";
				except = "UNKNOWN Lauguage";
			}
			returnvalue = String(returnvalue);
			log = String(log);
			except = String(except);
			if (returnvalue.match(token) ||
				log.match(token) ||
				except.match(token)) {
				msg.channel.send("トークンを盗む行為が検出されました。");
				return;
			}
			msg.channel.send(
				"```" + cmd + "\n" +
				"author     :" + msg.author.tag + "\n" +
				"returnvalue:" + returnvalue + "\n" +
				"print      :" + log + "\n" +
				"code       :" + args.join(" ") + "\n" +
				"except     :" + except + "\n" +
				"```"
			)
		} else if (type = "Sbs") {
			var result = [];
			var b = "";
			var prog = undefined;
			if (cmd == "google") {
				prog = await msg.channel.send("Download...")
				var a = client.fetchSync('http://www.google.com/search', { q: args[0] });
				prog.edit("Parseing")
				a.$("#rso .srg .g").each(function () {
					var title = a.$(this).find("h3");
					var url = a.$(this).find(".r a").attr("href");
					if (url) {
						result.push({
							title: title.text(),
							url: url
						})
					}
				})
			} else if (cmd == "yahoo") {
				prog = await msg.channel.send("Download...")
				//$("html body #wrapper ._pdd #contents .uWrap #mIn #WS2m")
				var a = client.fetchSync('https://search.yahoo.co.jp/search', { p: encodeURIComponent(args[0]) });
				prog.edit("Parseing")
				result.push({
					title: "title",
					url: "url"
				})
				a.$("#wrapper #contents .uWrap")
					.children()[0]
					.children[0]
					.children[2]
					.children
					.filter((a) => {
						return a.attribs.class == "w"
					}).map((v, i) => {
						return a.$(v)
					}).map((v, i) => {
						var title = a.$(v.children()[0]).text();
						var url = a.$(v.children()[1]).find(".a .u").text();
						result.push({
							title: title,
							url: url
						})
					})
			}
			for (i = 0; i < result.length; i++) {
				var a = result[i];
				b = b + `${a.title}: ${a.url}\n`;
			}
			prog.edit("Search\n" + b)
		}

	})

})();
function ai(msg, args) {
	var tokens = tokenize.tokenize(args.join(" "));
	var main_pos = tokens.map((a) => { return a.pos }).indexOf("名詞");
	var main = tokens[main_pos];
	if (!main) {
		main = tokens[0];
	}
	msg.channel.send(generate_marcof_str_fiastword(main.surface_form, convert_marcof_dict(marcof_dict), 100));
	generate_marcof_dict(tokenize, [args.join(" ")]);
	save_marcof_dict();
	words.push.call(0, tokens.map((a) => { return a.surface_form }));
	fs.writeJSONSync("siritori.json", words)
}
//#region marcof
async function generate_marcof_dict(tokenizer, pts, mrcof_dict_) {

	for (i = 0; i < pts.length; i++) {
		tokens = marcof_tokenize(tokenizer, pts[i])
		for (j = 0; j < tokens.length; j++) {
			if (tokens[j + 1] != undefined) {
				if (marcof_dict[tokens[j]] == undefined) {
					marcof_dict[tokens[j]] = {}
				}
				if (marcof_dict[tokens[j]][tokens[j + 1]] == undefined) {
					marcof_dict[tokens[j]][tokens[j + 1]] = 0
				}
				marcof_dict[tokens[j]][tokens[j + 1]]++;
			}
		}
	}

	return marcof_dict;

}
function convert_marcof_dict() {
	var new_dict = {};
	for (keyf in marcof_dict) {
		var max = "";
		for (keys in marcof_dict[keyf]) {
			if (marcof_dict[keyf][max] < marcof_dict[keyf][keys]) {
				max = keys
			}
		}
		if (max == "") {
			new_dict[keyf] = keys;
		} else {
			new_dict[keyf] = max;
		}
	}
	return new_dict;
}
function generate_marcof_str(dict, max) {
	if (!max) max = 10;
	var str = "";
	debugger
	var dict_keys = Object.keys(dict);
	var word_count = dict_keys.length;
	var start_ = Math.floor(Math.random() * word_count - 1)
	var start = dict[dict_keys[start_]]
	str += start;
	for (i = 0; i < max; i++) {
		start = dict[start]
		if (!start) {
			start_ = Math.floor(Math.random() * word_count - 1)
			start = dict[dict_keys[start_]]

		}
		str += start;
	}
	return str
}
function generate_marcof_str_fiastword(start__, dict, max) {
	if (!max) max = 10;
	var str = "";
	var dict_keys = Object.keys(dict);
	var start_num = dict_keys.indexOf(start__);
	if (start_num == -1) {
		return generate_marcof_str(dict, max)
	}
	var start = dict_keys[start_num];
	str += start;
	for (i = 0; i < max; i++) {
		start = dict[start]
		if (!start) {
			break;

		}
		str += start;
	}
	return str
}
function marcof_tokenize(tokenizer, str) {
	a = tokenizer.tokenize(str);
	b = a.map((a) => { return a.surface_form })
	return b
}

function gettokenize(builder) {
	return new Promise((resolve, reject) => {
		builder.build((err, tokenize) => {
			if (err) console.error(err)
			resolve(tokenize)
		})
	})
}
function save_marcof_dict() {
	fs.writeJSONSync("word.json", marcof_dict);
	console.log("D:[MARCOF ]:saved");
}
//#endregion
function kuromoji_build(builder) {
	return new Promise((resolve, reject) => {
		builder.build((err, tokenize) => {
			if (err) reject(err);
			resolve(tokenize);
		})
	});
}
function discord_login(discord, token) {
	return new Promise((resolve, reject) => {
		var client_syoch = new discord.Client();
		client_syoch.login(token);
		client_syoch.on("ready", () => {
			resolve(client_syoch);
		});

	})
}
async function analyze_allc(analyze_, client_syoch) {
	channels = client_syoch.channels.array();

	channels = channels
		.filter((a) => { return a.fetchMessage })
		.filter((a) => { return a.name != undefined })
		.filter((a) => { return a.name.match(/雑談/ig) })
	for (i = 0; i < channels.length; i++) {
		//console.log(channel.fetchMessage)
		try {
			msgs_ = await channels[i].fetchMessages()
		} catch (error) {

		}
		marcof_tmp = [...marcof_tmp, ...(msgs_.array().map((a) => { return a.content }))]
		msgs = msgs_.array();
		//console.log(msgs[0].content)
		for (var j = 0; j < msgs.length; j++) {
			//console.log(msgs[j].content);
			word.push(analyze_(msgs[j].content))
		}
		console.log("I:[DISCORD]:done", channels[i].name)
	}
}
function analyze(tokenize, src) {
	tmp_ = tokenize.tokenize(src);
	//console.log(tmp_)
	raw =
		tmp_.filter((a) => { return a.pos.match(/名詞|形容詞|副詞/) })
			.filter((a) => { return a.basic_form.length != 1 || a.surface_form.length != 1 })
			.filter((a) => { return a.word_type == 'KNOWN' })
			.map((a) => { return kana2hira(a.reading) })

	return raw;
}
function kana2hira(str) {
	return str.replace(/[\u30a1-\u30f6]/g, function (match) {
		var chr = match.charCodeAt(0) - 0x60;
		return String.fromCharCode(chr);
	});
}
async function create_crazyenglish(row_, col_) {
	var i = 0, j = 0;
	var out = "";
	var word_len = wordlist_en.length;
	var col = parseInt(col_);
	var row = parseInt(row_);
	console.log(col, row);
	for (i = 0; i < row; i++) {
		for (j = 0; j < col; j++) {
			out += `${wordlist_en[Math.floor(Math.random() * word_len)]} `
		}
		out += "\n"
	}
	src = "```\n" + out + "\n```";

	trasnlated_ = await translate(out, { to: "ja" })
	tra = "```\n" + trasnlated_.text + "\n```";
	out = src + "\nv\n" + tra;
	return out;
}
function evalpy(src) {
	return new Promise((resolve, reject) => {
		var program = `print(eval('${src.replace(/\'/ig, "\"")}'))`
		PythonShell.runString(program, { pythonPath: option.pythonPath }, function (err, data) {
			if (err) reject(err);
			resolve(data);
		});
	})
}
function getlink(id) {
	return new Promise((resolve) => {
		https.get(`https://www.youtube.com/get_video_info?video_id=${id}`, function (res) {
			var resultdata = "";
			res.on("data", (chunk) => {
				resultdata += chunk.toString()
			});
			res.on("end", () => {
				var decoded = decodeURIComponent(resultdata)
				var splited = decoded.split("&")
				var type = "";
				var ret = [];
				var video = "", audio = "";
				for (var b in splited) {
					var c = decodeURIComponent(splited[b]).split("=");
					if (c[0] == "type") {
						type = c[1];
					} else if (c[0] == "url") {
						var url = c.slice(1).join("=");
						console.log(type)
						ret.push({
							type: type,
							url: ""
						})

						if (type.slice(0, 5) == "video") {
							video = url;
						} else if (type.slice(0, 5) == "audio") {
							audio = url;
						}
					}
				}
				resolve([video, audio]);

			})
		})
	})
}
function short_url(fromurl) {
	return new Promise((resolve, rejext) => {
		https.request({
			method: "POST",

		}, (res) => {
			res.on("data")
		})
	})
}
