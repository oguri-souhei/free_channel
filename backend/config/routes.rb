Rails.application.routes.draw do
  devise_for :users, skip: %i(sessions passwords registrations)

  namespace :api do
    namespace :v1 do
      resources :users, only: :show
      get '/login_user', to: 'users#login_user', as: :login_user

      namespace :auth do
        post '/sign_up', to: 'registrations#create', as: :sign_up
        post '/login', to: 'sessions#create', as: :login
        delete '/logout', to: 'sessions#destroy', as: :logout

        scope :registrations do
          patch '/', to: 'registrations#update', as: :registrations
          delete '/', to: 'registrations#destroy'
        end
      end
    end
  end
end
