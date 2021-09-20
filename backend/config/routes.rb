Rails.application.routes.draw do
  mount ActionCable.server => '/cable'
  devise_for :users, skip: %i(sessions passwords registrations)

  namespace :api do
    namespace :v1 do
      get '/login_user', to: 'users#login_user', as: :login_user

      scope :rooms do
        get '/search', to: 'rooms#search', as: :rooms_search
      end

      resources :users, only: :show

      resources :rooms, only: [:index, :show, :create, :update, :destroy] do
        resources :comments, only: [:create, :destroy], shallow: true do
          resources :favorites, only: [:index, :create], shallow: true
          resource :favorite, only: :destroy
        end
      end

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
