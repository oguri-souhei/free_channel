class Api::V1::ApplicationController < ApplicationController
  private

  def require_no_authentication
    if user_signed_in?
      render json: { message: 'User has already been logged in.' }, status: :forbidden
    end
  end

  def require_authentication
    unless user_signed_in?
      render json: { message: 'ログインしてください' }, status: :unauthorized
    end
  end
end
