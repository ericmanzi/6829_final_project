pathImg = 'result/logs_mmlink_16up/screenshots';
filesImg = dir(fullfile(pathImg, '*.jpg'));
imold = uint8(zeros(size(imread(fullfile(pathImg, filesImg(1).name)))));
im = imold;
rebufs = [];
curRebuf = 0;
lastTs = 0;
for i = 1:numel(filesImg)
    fileImg = fullfile(pathImg, filesImg(i).name);
    parts = strsplit(filesImg(i).name, '_');
    ts = str2double(parts(1));
    im = imread(fileImg);
    if sum(sum(sum(im - imold))) == 0
        fileImg
        curRebuf = curRebuf + ts - lastTs;
    else
        if curRebuf > 0
            rebufs = [rebufs curRebuf];
        end
        curRebuf = 0;
    end
    imold = im;
    lastTs = ts;
end
rebufs'
        
        