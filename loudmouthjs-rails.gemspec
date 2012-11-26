# -*- encoding: utf-8 -*-
require File.expand_path('../lib/loudmouthjs-rails/version', __FILE__)

Gem::Specification.new do |gem|
  gem.authors       = ["Pete Campbell"]
  gem.email         = ["pete@sumirolabs.com"]
  gem.description   = "Shout about JavaScript errors and alerts in both dev and production."
  gem.summary       = "Loudmouth tells you about JavaScript errors that occur in your app. It can complain loudly (eg. alerts) or silently (posting the error info back to your server). It can also tell you what alerts the users have seen."
  gem.homepage      = "http://code.livingsocial.net/petecampbell/loudmouth"

  gem.files         = `git ls-files`.split($\)
  gem.name          = "loudmouthjs-rails"
  gem.require_paths = ["lib"]
  gem.version       = Loudmouthjs::Rails::VERSION
  gem.add_dependency "railties", "~> 3.1"
end
