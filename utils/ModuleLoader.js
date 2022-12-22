const fs = require("fs");
const _dirname = process.cwd();
const config = require(_dirname + "/config/config");

module.exports = class ModuleLoader {
  constructor({ modulesDir }) {
    {
      this.modulesDir = modulesDir;
    }
  }

  //Lädt alle module aus dem Modul ordner
  async loadModules() {
    fs.readdir(_dirname + this.modulesDir, (err, files) => {
      files.forEach(async (file) => {
        //Prüft ob das Modul in der Config registriert wurde
        if (!Object.keys(config.modules).includes(file)) {
          console.error(
            `Das Modul ${file} wurde nicht in der Config registriert!`
          );
          return;
        }

        //Prüft ob eine module.js erstellt und initialisiert wurde
        try {
          if (!fs.existsSync(_dirname + `/modules/${file}/module.js`)) {
            console.error(`Das Modul ${file} konnte nicht initalisiert werden!`);
            return;
          } 
        } catch (error) {
          console.error(err)
        }


        //Initisialisiert das Module
        const Module = require(_dirname + `/modules/${file}/module.js`);

        let module = new Module();

        console.log(`Das Module ${file} wurde erfolgreich geladen!`)

        await module.init();
      });
    });
  }
};
