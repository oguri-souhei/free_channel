class Api::V1::RoomsController < Api::V1::ApplicationController
  before_action :require_authentication, only: [:create, :update, :destroy]
  before_action :set_room, only: [:show, :create, :update, :destroy, :info]
  before_action :correct_user?, only: [:update]

  rescue_from ActiveRecord::RecordNotFound, with: :render_status_404

  # GET /api/v1/rooms
  def index
    size = 50
    rooms = Room.page(params[:page]).per(size).map(&:data)
    length = (Room.count.to_f / size).ceil
    render json: { data: { rooms: rooms, length: length } }, status: :ok
  end

  # GET /api/v1/rooms/:id
  def show
    comments = @room.comments.map { |comment| comment.data(current_user) }
    render json: { data: { room: @room, comments: comments } }, status: :ok
  end

  # POST /api/v1/rooms
  def create
    if @room.save
      render json: { data: @room }, status: :ok
    else
      render json: { errors: @room.errors.full_messages }, status: :bad_request
    end
  end

  # PATCH /api/v1/rooms/:id
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
    size = 50
    if params[:q].blank?
      rooms = Room.page(params[:page]).per(size).map(&:data)
      length = (Room.count.to_f / size).ceil
    else
      results = Room.search(params[:q])
      rooms = results.page(params[:page]).per(size).map(&:data)
      length = (results.count.to_f / size).ceil
    end

    render json: { data: { rooms: rooms, length: length } }, status: :ok
  end

  # GET /api/v1/rooms/:room_id/info
  def info
    render json: { data: @room }, status: :ok
  end

  private

  def room_params
    params.require(:room).permit(:name, :category)
  end

  def set_room
    if action_name == 'create'
      @room = current_user.rooms.build(room_params)
    elsif action_name == 'info'
      @room = Room.find(params[:room_id])
    else
      @room = Room.find(params[:id])
    end
  end

  def correct_user?
    return if current_user.id == @room.user_id
    render json: {}, status: :forbidden
  end
end
