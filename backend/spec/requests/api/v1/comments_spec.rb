require 'rails_helper'

RSpec.describe 'Comments', type: :request do
  let(:tom) { create(:tom) }
  let(:other_user) { create(:user) }
  let(:tom_room) { create(:room, user: tom) }
  let(:tom_comment) { create(:comment, user: tom) }
  let(:comment_params) { attributes_for(:comment) }
  let(:invalid_comment_params) { attributes_for(:comment, sentence: ' ') }

  describe 'POST /rooms/:room_id/comments' do
    context 'when user is logged in' do
      before do
        login_as tom
      end

      context 'when params is valid' do
        it 'responds :ok' do
          post api_v1_room_comments_path(tom_room), params: { comment: comment_params }
          expect(response).to have_http_status :ok
        end

        it 'render json' do
          post api_v1_room_comments_path(tom_room), params: { comment: comment_params }
          expect(response).to have_content_type :json
        end

        it 'render comment data' do
          post api_v1_room_comments_path(tom_room), params: { comment: comment_params }
          data = JSON.parse(response.body)['data']
          aggregate_failures do
            expect(data['sentence']).to eq comment_params[:sentence]
            expect(data['user_id']).to eq tom.id
            expect(data['room_id']).to eq tom_room.id
          end
        end

        it 'create room' do
          expect {
            post api_v1_room_comments_path(tom_room), params: { comment: comment_params }
          }.to change(Comment, :count).by(1)
        end
      end

      context 'when params is invalid' do
        it 'responds :bad_request' do
          post api_v1_room_comments_path(tom_room), params: { comment: invalid_comment_params }
          expect(response).to have_http_status :bad_request
        end

        it 'render json' do
          post api_v1_room_comments_path(tom_room), params: { comment: invalid_comment_params }
          expect(response).to have_content_type :json
        end

        it 'render errors' do
          post api_v1_room_comments_path(tom_room), params: { comment: invalid_comment_params }
          err = JSON.parse(response.body)['errors']
          aggregate_failures do
            expect(err.length).to eq 1
            expect(err[0]).to eq 'コメントを入力してください'
          end
        end

        it 'does not create comment' do
          expect {
            post api_v1_room_comments_path(tom_room), params: { comment: invalid_comment_params }
          }.to_not change(Comment, :count)
        end
      end
    end

    context 'when user is not logged in' do
      it 'responds :unauthorized' do
        post api_v1_room_comments_path(tom_room), params: { comment: comment_params }
        expect(response).to have_http_status :unauthorized
      end

      it 'render json' do
        post api_v1_room_comments_path(tom_room), params: { comment: comment_params }
        expect(response).to have_content_type :json
      end

      it 'does not create comment' do
        expect {
          post api_v1_room_comments_path(tom_room), params: { comment: comment_params }
        }.to_not change(Comment, :count)
      end
    end
  end

  describe 'DELETE /comments/:id' do
    context 'when user is logged in' do
      before do
        login_as tom
      end

      it 'responds :ok' do
        delete api_v1_comment_path(tom_comment)
        expect(response).to have_http_status :ok
      end

      it 'render json' do
        delete api_v1_comment_path(tom_comment)
        expect(response).to have_content_type :json
      end

      it 'destroy comment' do
        tom_comment
        expect {
          delete api_v1_comment_path(tom_comment)
        }.to change(Comment, :count).by(-1)
      end
    end

    context 'when user is not logged in' do
      it 'responds :unauthorized' do
        delete api_v1_comment_path(tom_comment)
        expect(response).to have_http_status :unauthorized
      end

      it 'render json' do
        delete api_v1_comment_path(tom_comment)
        expect(response).to have_content_type :json
      end

      it 'does not destroy comment' do
        tom_comment
        expect {
          delete api_v1_comment_path(tom_comment)
        }.to_not change(Comment, :count)
      end
    end

    context 'when other user is logged in' do
      before do
        login_as other_user
      end

      it 'responds :forbidden' do
        delete api_v1_comment_path(tom_comment)
        expect(response).to have_http_status :forbidden
      end

      it 'render json' do
        delete api_v1_comment_path(tom_comment)
        expect(response).to have_content_type :json
      end

      it 'does not destroy comment' do
        tom_comment
        expect {
          delete api_v1_comment_path(tom_comment)
        }.to_not change(Comment, :count)
      end
    end

    context 'when the comment is not found' do
      before do
        login_as tom
      end

      it 'responds :not_found' do
        delete api_v1_comment_path(tom_comment.id + 1000)
        expect(response).to have_http_status :not_found
      end

      it 'render json' do
        delete api_v1_comment_path(tom_comment.id + 1000)
        expect(response).to have_content_type :json
      end
    end
  end
end
