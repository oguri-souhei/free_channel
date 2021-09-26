require 'rails_helper'

RSpec.describe 'Api::V1::Users', type: :request do
  let(:tom) { create(:tom) }

  describe 'GET /api/v1/users/:id' do
    context 'when user is found' do
      before do
        @rooms = create_list(:room, 12, user: tom)
        get api_v1_user_path(tom)
      end

      it 'responds :ok' do
        expect(response).to have_http_status :ok
      end

      it 'render json' do
        expect(response).to have_content_type :json
      end

      it 'render user data' do
        data = JSON.parse(response.body)['data']
        aggregate_failures do
          expect(data['user']['id']).to eq tom.id
          expect(data['user']['name']).to eq tom.name
          expect(data['user']['email']).to eq tom.email
          expect(data['user']['password']).to be_blank
          expect(data['user']['password_confirmation']).to be_blank
          expect(data['user']['encrypted_password']).to be_blank
          expect(data['rooms'].length).to eq 12
          expect(data['rooms'][0]['id']).to eq @rooms[0].id
          expect(data['rooms'][1]['id']).to eq @rooms[1].id
        end
      end
    end

    context 'when user is not found' do
      before do
        get api_v1_user_path(tom.id + 100)
      end

      it 'responds :not_found' do
        expect(response).to have_http_status :not_found
      end

      it 'render json' do
        expect(response).to have_content_type :json
      end

      it 'render error message' do
        msg = JSON.parse(response.body)['message']
        expect(msg).to eq '404 not found'
      end
    end
  end

  describe 'GET /api/v1/login_user' do
    context 'when user is logged in' do
      before do
        login_as tom
        get api_v1_login_user_path
      end

      it 'responds :ok' do
        expect(response).to have_http_status :ok
      end

      it 'render json' do
        expect(response).to have_content_type :json
      end

      it 'render current_user data' do
        data = JSON.parse(response.body)['data']
        aggregate_failures do
          expect(data['id']).to eq tom.id
          expect(data['name']).to eq tom.name
          expect(data['email']).to eq tom.email
          expect(data['created_at']).to_not be_blank
          expect(data['updated_at']).to_not be_blank
          # パスワードなどが含まれていないか？
          expect(data['password']).to be_blank
          expect(data['password_confirmation']).to be_blank
          expect(data['encrypted_password']).to be_blank
        end
      end
    end

    context 'when user is not logged in' do
      before do
        get api_v1_login_user_path
      end

      it 'responds :ok' do
        expect(response).to have_http_status :ok
      end

      it 'render json' do
        expect(response).to have_content_type :json
      end

      it 'render data nil' do
        data = JSON.parse(response.body)['data']
        expect(data).to be_nil
      end
    end
  end
end
