class Api::V1::UsersController < Api::V1::ApplicationController
  rescue_from ActiveRecord::RecordNotFound, with: :render_status_404

  # GET /api/v1/users/:id
  def show
    user = User.find(params[:id])
    rooms = user.rooms.map(&:data)
    render json: { data: { user: user, rooms: rooms } }, status: :ok
  end

  # GET /api/v1/login_user
  def login_user
    render json: { data: current_user }, status: :ok
  end
end
