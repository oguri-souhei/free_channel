class Api::V1::ApplicationController < ApplicationController
  private

  def require_no_authentication
    if current_user
      render json: { message: 'User has already been logged in.' }, status: :forbidden
    end
  end
end
