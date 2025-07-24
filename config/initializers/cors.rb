Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'https://ruby.quantumkya.dev', 'http://localhost:3000'

    resource '/api/*',
      headers: :any,
      methods: [:get, :post, :patch, :put, :delete, :options],
      credentials: false
  end
end
