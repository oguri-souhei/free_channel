require 'rails_helper'

RSpec.describe 'Api::V1::Favorites', type: :request do
  let(:tom) { create(:tom) }
  let(:comment) { create(:comment) }
  let(:favorite) { create(:favorite) }

  describe 'GET /api/v1/comments/:comment_id/favorites' do
    context 'when success' do
      before do
        create_list(:favorite, 10, comment: comment)
        get api_v1_comment_favorites_path(comment)
      end

      it 'responds :ok' do
        expect(response).to have_http_status :ok
      end

      it 'renders json' do
        expect(response).to have_content_type :json
      end

      it 'renders favorites' do
        data = JSON.parse(response.body)['data']
        expect(data.length).to eq 10
      end
    end

    context 'when comment is not found' do
      before do
        get api_v1_comment_favorites_path(comment.id + 100)
      end

      it 'responds :not_found' do
        expect(response).to have_http_status :not_found
      end

      it 'renders json' do
        expect(response).to have_content_type :json
      end
    end
  end

  describe 'POST /api/v1/comments/:comment_id/favorites' do
    context 'when success' do
      before do
        login_as tom
      end

      it 'responds :ok' do
        post api_v1_comment_favorites_path(comment)
        expect(response).to have_http_status :ok
      end

      it 'renders json' do
        post api_v1_comment_favorites_path(comment)
        expect(response).to have_content_type :json
      end

      it 'creates a record' do
        expect {
          post api_v1_comment_favorites_path(comment)
        }.to change(Favorite, :count).by(1)
      end
    end

    context 'when user is not logged in' do
      it 'responds :bad_request' do
        post api_v1_comment_favorites_path(comment)
        expect(response).to have_http_status :unauthorized
      end

      it 'renders json' do
        post api_v1_comment_favorites_path(comment)
        expect(response).to have_content_type :json
      end

      it 'does not create a record' do
        expect {
          post api_v1_comment_favorites_path(comment)
        }.to_not change(Favorite, :count)
      end
    end

    context 'when comment is not found' do
      before do
        login_as tom
      end

      it 'responds :not_found' do
        post api_v1_comment_favorites_path(comment.id + 100)
        expect(response).to have_http_status :not_found
      end

      it 'renders json' do
        post api_v1_comment_favorites_path(comment.id + 100)
        expect(response).to have_content_type :json
      end

      it 'does not create a record' do
        expect {
          post api_v1_comment_favorites_path(comment.id + 100)
        }.to_not change(Favorite, :count)
      end
    end
  end

  describe 'DELETE /api/v1/favorites/:id' do
    context 'when success' do
      before do
        login_as tom
      end

      it 'responds :ok' do
        delete api_v1_favorite_path(favorite)
        expect(response).to have_http_status :ok
      end

      it 'renders json' do
        delete api_v1_favorite_path(favorite)
        expect(response).to have_content_type :json
      end

      it 'destroys a record' do
        favorite
        expect {
          delete api_v1_favorite_path(favorite)
        }.to change(Favorite, :count).by(-1)
      end
    end

    context 'when user is not logged in' do
      it 'responds :unauthorized' do
        delete api_v1_favorite_path(favorite)
        expect(response).to have_http_status :unauthorized
      end

      it 'renders json' do
        delete api_v1_favorite_path(favorite)
        expect(response).to have_content_type :json
      end

      it 'does not destroy a record' do
        favorite
        expect {
          delete api_v1_favorite_path(favorite)
        }.to_not change(Favorite, :count)
      end
    end

    context 'when favorite is not found' do
      before do
        login_as tom
      end

      it 'responds :not_found' do
        delete api_v1_favorite_path(favorite.id + 100)
        expect(response).to have_http_status :not_found
      end

      it 'renders json' do
        delete api_v1_favorite_path(favorite.id + 100)
        expect(response).to have_content_type :json
      end

      it 'does not destroy a record' do
        favorite
        expect {
          delete api_v1_favorite_path(favorite.id + 100)
        }.to_not change(Favorite, :count)
      end
    end
  end
end
