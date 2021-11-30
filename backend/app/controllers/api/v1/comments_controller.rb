class Api::V1::CommentsController < Api::V1::ApplicationController
  before_action :require_authentication, only: [:create, :destroy]
  before_action :set_comment, only: [:create, :destroy]
  before_action :correct_user?, only: [:destroy]

  rescue_from ActiveRecord::RecordNotFound, with: :render_status_404

  # POST /api/v1/rooms/:room_id/comments
  def create
    if @comment.save
      render json: { data: @comment }, status: :ok
    else
      render json: { errors: @comment.errors.full_messages }, status: :bad_request
    end
  end

  # DELETE /api/v1/comments/:id
  def destroy
    @comment.destroy
    render json: {}, status: :ok
  end

  private

  def comment_params
    params.require(:comment).permit(:sentence, :opinion)
  end

  def set_comment
    if action_name == 'create'
      @comment = current_user.comments.build(comment_params)
      @comment.room_id = params[:room_id]
    else
      @comment = Comment.find(params[:id])
    end
  end

  def correct_user?
    return if current_user.id == @comment.user_id
    render json: {}, status: :forbidden
  end
end
