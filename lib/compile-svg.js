var SVGSpriter = Npm.require("svg-sprite");
var fs = Plugin.fs;
var StringDecoder = Npm.require('string_decoder').StringDecoder;
var decoder = new StringDecoder('utf8');

Plugin.registerCompiler({
  extensions: ["svg"],
  archMatching: 'web',
  filenames: []
}, function () {
  var compiler = new SVGCompiler();
  return compiler;
});

function SVGCompiler() {};

SVGCompiler.prototype.processFilesForTarget = function (files) {
  var outputPath = "/somepath/";

  //Spriter config
  var spriter = new SVGSpriter({
    dest: outputPath,
    // log: "debug",
    mode: {
      symbol: {
        inline: true
      }
    }
  });

  //Iterate over files and add them to spriter
  files.forEach(function (file) { 

    var fullPath = process.cwd() + '/' + file._resourceSlot.inputResource.path;
    var fileName = fullPath.replace(/^.*[\\\/]/, '');
    var data = fs.readFileSync(fullPath, {encoding: 'utf-8'});

    spriter.add(
      fullPath,
      fileName,
      data
    );        
  });

  //Compile sprite to destination
  spriter.compile(function(err, res, data){

    var svg = res.symbol.sprite.contents.toString('utf8');

    //Add the resulting data
    files[0].addHtml({section: "body", data: '<div class="svg-sprite">'+svg+'</div>'});

  });

};