class Api::V1::UsersController < ApplicationController
  # GET /api/v1/login_user
  def login_user
    render json: { data: current_user }, status: :ok
  end
end
