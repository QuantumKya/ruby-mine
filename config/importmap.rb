# Pin npm packages by running ./bin/importmap

pin "application"
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"
pin_all_from "app/javascript/controllers", under: "controllers"

pin "stats_helper", to: "helpers/stats_helper.js"
pin "mine", to: "controllers/mine_controller.js"
pin "shop", to: "controllers/shop_controller.js"