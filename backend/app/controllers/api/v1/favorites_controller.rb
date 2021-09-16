class Api::V1::FavoritesController < Api::V1::ApplicationController
  rescue_from ActiveRecord::RecordNotFound, with: :render_status_404

  before_action :require_authentication, only: [:create, :destroy]
  before_action :set_favorite, only: [:create, :destroy]

  # GET /api/v1/comments/:comment_id/favorites
  def index
    comment = Comment.find(params[:comment_id])
    favorites = comment.favorites
    render json: { data: favorites }, status: :ok
  end

  # POST /api/v1/comments/:comment_id/favorites
  def create
    if @favorite.save
      render json: { data: @favorite }, status: :ok
    else
      render json: { errors: @favorite.errors.full_messages }, status: :bad_request
    end
  end

  # DELETE /api/v1/favorites/:id
  def destroy
    if @favorite.destroy
      render json: {}, status: :ok
    else
      render json: {}, status: :bad_request
    end
  end

  private

  def set_favorite
    if action_name == 'create'
      comment = Comment.find(params[:comment_id])
      @favorite = current_user.favorites.build(comment: comment)
    elsif action_name == 'destroy'
      @favorite = Favorite.find(params[:id])
    end
  end
end
