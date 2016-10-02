Rails.application.routes.draw do
  root 'top#index'

  resources :loves do
    scope module: :loves do
      resources :supplementals, only: %i(new create destroy)
    end
  end
  resources :categories, only: :show
  resources :user_sessions
  resources :members

  get 'login' => 'user_sessions#new', as: :login
  post 'logout' => 'user_sessions#destroy', as: :logout
end
