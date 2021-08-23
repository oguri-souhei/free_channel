Rails.application.routes.draw do
  devise_for :users, skip: %i(sessions passwords registrations)

  namespace :api do
    namespace :v1 do
      namespace :auth do
        post '/login', to: 'sessions#create', as: :login
      end
    end
  end
end
