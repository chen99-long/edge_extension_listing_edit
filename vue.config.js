const CopyWebpackPlugin = require('copy-webpack-plugin')
const FileManagerPlugin = require('filemanager-webpack-plugin')
const path = require('path')
const version = require('./package.json').version
const name = require('./package.json').name
module.exports = {
  lintOnSave: false,
  productionSourceMap: false,
  pages: {
    popup: {
      template: 'public/popup.html',
      entry: './src/js/popup.js',
      title: 'Popup'
    },
    options: {
      template: 'public/options.html',
      entry: './src/js/options.js',
      title: 'Options'
    }
  },
  pluginOptions: {
    browserExtension: {
      componentOptions: {
        background: {
          entry: 'src/js/background.js'
        },
        contentScripts: {
          entries: {
            'content-script': [
              'src/content-scripts/content-script.js'
            ]
          }
        }
      }
    }
  },
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin([
        {
          from: 'src/manifest.json',
          to: 'manifest.json',
          force: true,
          transform: (content) => {
            // 读取manifest.json
            const jsonContent = JSON.parse(content)
            // 设置版本号
            jsonContent.version = version
            // TODO 先在.env和.env_edge中设置homeurl地址再接触注释
            // jsonContent.homepage_url = process.env.VUE_APP_HOME_URL
            if (jsonContent.content_security_policy) delete jsonContent.content_security_policy // 如果有csp选项 就删掉
            return JSON.stringify(jsonContent, null, 2)
          }
        }
      ]),
      new FileManagerPlugin(
        {
          events: {
            onEnd: {
              archive: process.env.NODE_ENV === 'production' ? [{
                source: path.join(__dirname, './dist'),
                destination: path.join(__dirname, 'already', name + '_' + version + '.zip')
              }] : []
            }
          }

        }
      )
    ]

  },
  css: {
    extract: false,
    loaderOptions: {
      sass: {
        prependData: '@import "@/styles/variables.scss";'
      }
    }
  }
}
