class Api::V1::FavoritesController < Api::V1::ApplicationController
  rescue_from ActiveRecord::RecordNotFound, with: :render_status_404

  before_action :require_authentication, only: [:create, :destroy]

  # GET /api/v1/comments/:comment_id/favorites
  def index
    comment = Comment.find(params[:comment_id])
    favorites = comment.favorites
    render json: { data: favorites }, status: :ok
  end

  # POST /api/v1/comments/:comment_id/favorites
  def create
    comment = Comment.find(params[:comment_id])
    current_user.favorite(comment)
    render json: {}, status: :ok
  end

  # DELETE /api/v1/favorites/:id
  def destroy
    favorite = Favorite.find(params[:id])
    favorite.destroy
    render json: {}, status: :ok
  end
end
