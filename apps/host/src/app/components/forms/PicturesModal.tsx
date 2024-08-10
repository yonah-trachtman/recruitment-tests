import { Grid, Modal } from '@mui/material';
import { Img, ServerContext } from '@base-frontend';
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import toast from 'react-hot-toast';
import { Asset } from '@offisito-shared';
import 'react-image-crop/dist/ReactCrop.css';
import ReactCrop, { type Crop } from 'react-image-crop';
import { TODO } from '@base-shared';
import {
  Btn,
  CloseButton,
  PictureUploader,
  PrimaryText,
} from '@offisito-frontend';

interface PicturesModalModalProps {
  setPicturesModal: Dispatch<SetStateAction<boolean>>;
  fetchSpace: (id: string) => Promise<void>;
  formState: Asset | undefined;
}

const PicturesModal = ({
  setPicturesModal,
  fetchSpace,
  formState,
}: PicturesModalModalProps) => {
  const [crop, setCrop] = useState<Crop>();
  const [selectedKey, setSelectedKey] = useState<string>();
  const [selectedPreview, setSelectedPreview] = useState<string>();
  const server = useContext(ServerContext);
  const [ready, setReady] = useState(false);

  const [deleting, setDeleting] = useState(false);

  return (
    <Modal open>
      <Grid
        height="73%"
        width="72%"
        marginLeft="14%"
        marginTop="7%"
        padding="2%"
        overflow="scroll"
        item
        container
        direction="column"
        rowSpacing={4}
        alignItems="center"
        wrap="nowrap"
        bgcolor={(theme) => theme.palette.background.default}
      >
        <Grid item>
          <CloseButton onClick={() => setPicturesModal(false)} />
        </Grid>
        <Grid item>
          <PrimaryText variant="h4">Pictures</PrimaryText>
        </Grid>
        {formState && (
          <>
            <Grid item>
              <PictureUploader
                cb={() => {
                  toast.success('Uploaded');
                  fetchSpace(String(formState?._id));
                }}
                endpoint={
                  'api/host/assets/images/upload_asset_img/' +
                  String(formState?._id)
                }
                actionName="Upload a Picture of the Asset"
                keys={formState.photos}
                previewUrls={formState.photoURLs}
                max={6}
                setSelectedKey={setSelectedKey}
                setSelectedPreview={setSelectedPreview}
                setReady={setReady}
                deletePicture={{
                  fn: (key: TODO) => {
                    setDeleting(true);
                    server?.axiosInstance
                      .delete(
                        'api/host/assets/images/' +
                          String(formState?._id) +
                          '/' +
                          btoa(key),
                      )
                      .then(() => {
                        toast.success('Deleted');
                        fetchSpace(String(formState?._id));
                      })
                      .finally(() => setDeleting(false));
                  },
                  deleting,
                  setDeleting,
                }}
              />
            </Grid>
            {!selectedKey && ready && (
              <Grid item>
                <PrimaryText textAlign="center">
                  Click on a picture to crop it
                </PrimaryText>
                <PrimaryText textAlign="center">
                  this action is not revertable unless you re-upload
                </PrimaryText>
              </Grid>
            )}
            <Grid item>
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                aspect={16 / 9}
              >
                <Img src={selectedPreview} />
              </ReactCrop>
            </Grid>
            {selectedKey && (
              <Grid item>
                <Btn
                  onClick={() =>
                    server?.axiosInstance
                      .put('api/host/assets/images/cropPicture', {
                        assetId: String(formState?._id),
                        key: selectedKey,
                        crop,
                      })
                      .then(() => toast.success('cropped'))
                      .catch(() => toast.error('crop failed'))
                      .finally(() => {
                        setSelectedPreview(undefined);
                        setSelectedKey(undefined);
                        setCrop(undefined);
                        fetchSpace(String(formState?._id));
                      })
                  }
                >
                  Save and upload Cropped Version
                </Btn>
              </Grid>
            )}
          </>
        )}
      </Grid>
    </Modal>
  );
};
export default PicturesModal;
