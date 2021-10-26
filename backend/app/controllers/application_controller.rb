class ApplicationController < ActionController::API
  # ELBのヘルスチェック用
  def health
    render json: {}, status: 200
  end
end
