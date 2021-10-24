Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins ENV['FRONTEND_HOST']
    resource '*',
             headers: :any,
             methods: [:get, :post, :patch, :delete, :head, :options],
             credentials: true # session・cookieのやり取りをする
  end
end
