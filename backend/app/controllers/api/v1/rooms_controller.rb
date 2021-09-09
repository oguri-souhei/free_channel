class Api::V1::RoomsController < Api::V1::ApplicationController
  before_action :require_authentication, only: [:create, :update, :destroy]
  before_action :set_room, only: [:show, :create, :update, :destroy]
  before_action :correct_user?, only: [:update]

  rescue_from ActiveRecord::RecordNotFound, with: :render_status_404

  # GET /api/v1/rooms/:id
  def show
    render json: { data: @room }, status: :ok
  end

  # POST /rooms
  def create
    if @room.save
      render json: { data: @room }, status: :ok
    else
      render json: { errors: @room.errors.full_messages }, status: :bad_request
    end
  end

  # PATCH /rooms/:id
  def update
    if @room.update(room_params)
      render json: { data: @room }, status: :ok
    else
      render json: { errors: @room.errors.full_messages }, status: :bad_request
    end
  end

  # DELETE /api/v1/rooms/:id
  def destroy
    if @room.destroy
      render json: {}, status: :ok
    else
      render json: {}, status: :bad_request
    end
  end

  # GET /api/v1/rooms/search
  def search
    if params[:category]
      rooms = Room.search_by_category(params[:category])
    elsif params[:name]
      rooms = Room.search_by_name(params[:name])
    else
      rooms = Room.all
    end
    render json: { data: rooms }, status: :ok
  end

  private

  def room_params
    params.require(:room).permit(:name, :category)
  end

  def set_room
    @room = action_name == 'create' ?
      current_user.rooms.build(room_params) : Room.find(params[:id])
  end

  def correct_user?
    return if current_user.id == @room.user_id
    render json: {}, status: :forbidden
  end
end